//start of the API call
const getDestinationInfo = () => {
    let destValue = encodeURIComponent(document.getElementById("destValue").value) //get the form value and properly enconde it as browser url
    let dateValue = document.getElementById("dateValue").value //getting travel date as human readable format yyyy-mm-dd
    let dateValueEpoch = document.getElementById("dateValue").valueAsNumber/1000 //getting travel date as Epoch
    // below four lines for progress bar
    let container = document.getElementsByClassName('container')[0];
    let progressBar = document.getElementsByClassName("bar-container")[0];
    let newProgressBar = progressBar.cloneNode(true);
    container.appendChild(newProgressBar);
    // 10 secs for progress bar
    setTimeout(function() {
        newProgressBar.classList.add('active');
        setTimeout(function() {
           
        }, 10000);
    }, 0);
    
    //clearing existing data on the UI
    let displayDiv = document.getElementById('entryHolder');
    displayDiv.innerHTML = ``;
    if(displayDiv.hasAttribute('class')){
    displayDiv.removeAttribute('class'); // removal of class to remove red color if exist
    }
    
    // calling getDestinationData function, chained promises which gets API data and updates the UI
    Client.getDestinationData(destValue,dateValueEpoch).then(function(projectData){
        //updateUI after successfull execution of POST data
        document.getElementsByClassName('bar-container active')[0].remove(); //removal of progress bar
        projectData.dest = document.getElementById("destValue").value;
        projectData.dateValue = dateValue;
        console.log(projectData);
        //now storing the object in the session so it can be used for saving using localStorage when user clicks on Save Button
        sessionStorage.setItem('projectData', JSON.stringify(projectData));        
        //let retrievedObject = JSON.parse(sessionStorage.getItem('sessionObj');
        Client.updateUI(projectData);
    }).catch(function(error){
        // incase error from the API, show a message on the UI that error has occured
        document.getElementsByClassName('bar-container active')[0].remove();
        Client.updateUIError(error);
      });

   return false; // this is very important otherwise user will be moved away from the current page
}

// storing in browser for good:
/*let testObject = { 'one': 1, 'two': 2, 'three': 3 };
localStorage.setItem('testObject', JSON.stringify(testObject));
let retrievedObject = JSON.parse(localStorage.getItem('testObject');*/

/*let testObject = { 'one': 1, 'two': 2, 'three': 3 };
sessionStorage.setItem('testObject', JSON.stringify(testObject));
let retrievedObject = JSON.parse(sessionStorage.getItem('testObject'));*/

// get data from node endpoint getURLClassification - this is async function
const getDestinationData = async (destValue,dateValueEpoch)=>{
    let apiUrl = 'http://localhost:3001/getDestData' // holding initial part of api url for the API
    let fullUrl = `${apiUrl}/${destValue}/${dateValueEpoch}`; //creating full API url
    console.log(fullUrl);
    const urlData = await fetch(fullUrl); // awaiting to get the data
     try{
            const data = await urlData.json();   //awaiting to convert to json format
            return data;
        }catch(error) {            
          //console.log("error", error);
          return error;
        }
    
    
}

// below dynamically updates UI
const updateUI = (projectData) => {
    try {
        //getting all the divs where data needs to be populated
        let displayDiv = document.getElementById('entryHolder');
        // if error is not there in the data
        if(!projectData.error){
            if(projectData.totalResultsCount == 0||projectData.travelDateGtSeven < 0){
                // this means zero results found so users has entered improper destination info
                let errDiv = document.createElement('div');
                errDiv.setAttribute('class','error') // creating class error for red color
                errDiv.setAttribute('id','error')
                if (projectData.totalResultsCount == 0){
                    errDiv.innerHTML = `<b>Destination NOT found. Please put proper destination.</b>`
                } 
                else {
                    errDiv.innerHTML = `<b>Travel Date cannot be in past. Please use proper travel date.</b>`
                }    
                displayDiv.appendChild(errDiv);
                let oldSaveButton = document.getElementById('saveBtn');
                if(oldSaveButton){
                    oldSaveButton.remove();
                }
            } 
            else 
            {
                let tempdiv; 
                let fig = document.createElement('figure');
                let img = document.createElement('img');
                img.setAttribute('style',"width:400px;height:320px;");
                if(projectData.imgURL){                    
                    img.setAttribute('src',`${projectData.imgURL}`);                    
                }
                else{
                    img.setAttribute('src',"./img-not-found.png");
                }
                
                fig.appendChild(img);
                displayDiv.appendChild(fig);
                
                if(projectData.dateValue){
                    tempdiv = document.createElement('div');
                    tempdiv.setAttribute('id','dateValue')
                    tempdiv.innerHTML = `<b>Travel Date:</b> ${projectData.dateValue}`;
                    displayDiv.appendChild(tempdiv);                    
                }                   
                if(projectData.dest){
                    tempdiv = document.createElement('div');
                    tempdiv.setAttribute('id','dest')
                    tempdiv.innerHTML = `<b>Travel Destination:</b> ${projectData.dest}`;
                    displayDiv.appendChild(tempdiv);                    
                }
                if(projectData.TZ){
                    tempdiv = document.createElement('div');
                    tempdiv.setAttribute('id','TZ')
                    tempdiv.innerHTML = `<b>Time Zone:</b> ${projectData.TZ}`;
                    displayDiv.appendChild(tempdiv);                    
                }
                if(projectData.countryName){
                    tempdiv = document.createElement('div');
                    tempdiv.setAttribute('id','countryName')
                    tempdiv.innerHTML = `<b>Country:</b> ${projectData.countryName}`;
                    displayDiv.appendChild(tempdiv);                    
                }
                if(projectData.dailySummary){
                    tempdiv = document.createElement('div');
                    tempdiv.setAttribute('id','weeklySummary')
                    tempdiv.innerHTML = `<b>Weekly Summary:</b> ${projectData.dailySummary}`;
                    displayDiv.appendChild(tempdiv);                    
                }                
                for (const day of projectData.daily) {
                    //populating empty array with dictionary data
                    let tempTime = new Date(day.time*1000);
                    let yyyy = tempTime.getFullYear()
                    let mm = ('0' + (tempTime.getMonth() + 1)).slice(-2)
                    let dd = ('0' + tempTime.getDate()).slice(-2)
                    let tempDate = `${yyyy}-${mm}-${dd}`;   //This will be used so that UI can pickup right day from the 7 - day weather Array
                    //below is bit HARD - you dont want to compare date if travel date is more than 7 days away since there is only one object in the array
                    if(tempDate == projectData.dateValue|| projectData.travelDateGtSeven>7){
                        if(day.summary){
                            tempdiv = document.createElement('div');
                            tempdiv.setAttribute('id','daySummary')
                            tempdiv.innerHTML = `<b>Travel Day Weather:</b> ${day.summary}`;
                            displayDiv.appendChild(tempdiv);                    
                        } 
                        if(day.sunriseTime){
                            tempdiv = document.createElement('div');
                            tempdiv.setAttribute('id','sunriseTime')
                            let sunriseTime = new Date(day.sunriseTime*1000)
                            tempdiv.innerHTML = `<b>Sunrise Time:</b> ${sunriseTime}`;
                            displayDiv.appendChild(tempdiv);                    
                        } 
                        if(day.sunsetTime){
                            tempdiv = document.createElement('div');
                            tempdiv.setAttribute('id','sunsetTime')
                            let sunsetTime = new Date(day.sunsetTime*1000)
                            tempdiv.innerHTML = `<b>Sunset Time:</b> ${sunsetTime}`;
                            displayDiv.appendChild(tempdiv);                    
                        }                          
                        if(day.precipProbability){
                            tempdiv = document.createElement('div');
                            tempdiv.setAttribute('id','precipProbability')
                            tempdiv.innerHTML = `<b>Percipitation Probability:</b> ${day.precipProbability} %`;
                            displayDiv.appendChild(tempdiv);                    
                        } 

                        if(day.icon && day.temperatureHigh && day.temperatureLow){
                            tempdiv = document.createElement('div');
                            tempdiv.setAttribute('class','high-img-low');
                            let hdiv = document.createElement('div');
                            hdiv.setAttribute('id','temperatureHigh');
                            hdiv.innerHTML = `High<br><b>${day.temperatureHigh} &#x2109;</b>`;
                            
                            let idiv = document.createElement('div');
                            idiv.setAttribute('id','icon');
                            idiv.setAttribute('name',`${day.icon}`);
                            let img = document.createElement('img');
                            img.setAttribute('src',`./${day.icon}.png`);
                            img.setAttribute('style',"width:64px;height:64px;");                            
                            idiv.appendChild(img);
                            
                            
                            let ldiv = document.createElement('div');
                            ldiv.setAttribute('id','temperatureLow');
                            ldiv.innerHTML = `High<br><b>${day.temperatureLow} &#x2109;</b>`;
                            
                            tempdiv.appendChild(hdiv);
                            tempdiv.appendChild(idiv);
                            tempdiv.appendChild(ldiv);
                            
                            displayDiv.appendChild(tempdiv);
                            
                        }                        
                        if(day.humidity){
                            tempdiv = document.createElement('div');
                            tempdiv.setAttribute('id','humidity')
                            day.humidity = day.humidity * 100;
                            tempdiv.innerHTML = `<b>Humidity:</b> ${day.humidity} %`;
                            displayDiv.appendChild(tempdiv);                    
                        }                            
                    }           
                }
              let btn = document.createElement('button')
              btn.setAttribute('id','saveBtn');
              btn.innerHTML = 'Save Trip';        
              displayDiv.appendChild(btn);     

                //event listner added to save projectData
                document.getElementById("saveBtn").addEventListener("click", function(){
                    console.log('save btn click');
                    let retrievedSessionObject = JSON.parse(sessionStorage.getItem('projectData'));
                    let displayDiv = document.getElementById('entryHolder');
                    if(!localStorage.destData){
                        console.log('btn clicked');                        
                        let destData = [];
                        destData.push(retrievedSessionObject);
                        localStorage.setItem('destData', JSON.stringify(destData));
                        document.getElementById('saveBtn').remove();
                        if(localStorage.destData){
                            tempdiv = document.createElement('div');
                            tempdiv.innerHTML = `<b>SAVED!!</b>`;
                            displayDiv.appendChild(tempdiv);             
                        } 
                        else {
                            tempdiv = document.createElement('div');
                            tempdiv.setAttribute('class','error'); // creating class error for red color
                            tempdiv.setAttribute('id','error');            
                            tempdiv.innerHTML = `<b>UNABLE TO SAVE</b>`;
                            displayDiv.appendChild(tempdiv);             
                        }
                    }
                    else{
                        console.log('inside else - btn clicked');
                        let retrievedStorageObject = JSON.parse(localStorage.getItem('destData'));
                        for (const dest of retrievedStorageObject){
                            console.log(`${dest.dest.toLowerCase()}-${retrievedSessionObject.dest.toLowerCase()}-${dest.dateValue}-${retrievedSessionObject.dateValue}`);
                            if (dest.dest.toLowerCase() == retrievedSessionObject.dest.toLowerCase() && dest.dateValue == retrievedSessionObject.dateValue){
                                tempdiv = document.createElement('div');
                                tempdiv.setAttribute('class','error'); // creating class error for red color
                                tempdiv.setAttribute('id','error');            
                                tempdiv.innerHTML = `<b>UNABLE TO SAVE - Destination and Travel Date combination already saved!!</b>`;
                                displayDiv.appendChild(tempdiv);                                    
                            }
                        }
                        
                    }
                });            
              
            }
        } else {
            // this means some sort of error
            let errDiv = document.createElement('div');
            errDiv.setAttribute('class','error'); // creating class error for red color
            errDiv.setAttribute('id','error');
            errDiv.innerHTML = `<b>${projectData.error}</b>`;
            displayDiv.appendChild(errDiv);            
        }
        
    }  catch(error) {
        //console.log("error", error);
        Client.updateUIError(error);
    }    
}

// Below funciton will update ui properly incase of some error from any function (error which is not part of projectDta returned by the main function above)
const updateUIError = (error)=>{
    //getting all the divs where data needs to be populated
    let displayDiv = document.getElementById('entryHolder');
    let errDiv = document.createElement('div');
    errDiv.setAttribute('class','error'); // creating class error for red color
    errDiv.setAttribute('id','error');
    errDiv.innerHTML = `<b>${error}</b>`;
    displayDiv.appendChild(errDiv);
}


// storing in browser for good:
/*let testObject = { 'one': 1, 'two': 2, 'three': 3 };
localStorage.setItem('testObject', JSON.stringify(testObject));
let retrievedObject = JSON.parse(localStorage.getItem('testObject');*/

/*let testObject = { 'one': 1, 'two': 2, 'three': 3 };
sessionStorage.setItem('testObject', JSON.stringify(testObject));
let retrievedObject = JSON.parse(sessionStorage.getItem('testObject'));*/




//jest  test function

function testapi(destValue,dateValueEpoch){
    console.log(getDestinationData(destValue,dateValueEpoch).length);
    return getDestinationData(destValue,dateValueEpoch).length;
}

// comment below line when doing a webpack build as it breaks webpack, uncomment while performing jest test
//module.exports = testapi;

// exporting it for webpack
export { getDestinationInfo };
export { getDestinationData };
export { updateUI };
export { updateUIError };