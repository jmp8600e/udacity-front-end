//start of Aylien API call
const getDestinationInfo = ()=>{
    let destValue = encodeURIComponent(document.getElementById("destValue").value) //get the form value and properly enconde it as browser url
    let dateValue = document.getElementById("dateValue").value //getting travel date
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
    // calling openAylienClassifyApi function, chained promises which gets API data and updates the UI
    getGeonamesData(destValue).then(function(projectData){
        //updateUI after successfull execution of POST data
        document.getElementsByClassName('bar-container active')[0].remove(); //removal of progress bar
        projectData.dest = document.getElementById("destValue").value;
        projectData.dateValue = dateValue;
        console.log(projectData);
        updateUI(projectData);
    }).catch(function(error){
        // incase error from the Aylien API show a message on the UI that error has occured
        updateUIError(error);
      });

   return false; // this is very important otherwise user will be moved away from the current page
}


// get data from node endpoint getURLClassification - this is async function
const getGeonamesData = async (destValue)=>{
    let apiUrl = 'http://localhost:3001/getFromGeonames' // holding initial part of api url for Aylien classify API
    let fullUrl = `${apiUrl}/${destValue}`; //creating full API url
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
        let div1 = document.getElementById('countryName');
        let div2 = document.getElementById('lat');
        let div3 = document.getElementById('lng');
        let div4 = document.getElementById('dest');
        let div5 = document.getElementById('travelDate');
        
        // if error is not there in the data
        if(!projectData.error){
            if(projectData.totalResultsCount == 0){
                // this means zero results found so users has entered improper destination info
                div1.setAttribute('class','error') // creating class error for red color
                div1.innerHTML = `<b>Destination NOT found. Please put proper destination.</b>`
                // setting all other divs to a blank value
                div2.innerHTML = ``;
                div3.innerHTML = ``;
                div4.innerHTML = ``;
                div5.innerHTML = ``;                
            } else {
                div1.innerHTML = `<b>Country:</b> ${projectData.countryName}`;
                if(div1.hasAttribute('class')){
                    div1.removeAttribute('class'); // removal of class to remove red color
                }
                div2.innerHTML = `<b>Latitude:</b> ${projectData.lat}`;
                div3.innerHTML = `<b>Longitude:</b> ${projectData.lng}`;
                div4.innerHTML = `<b>Destination Entered:</b> ${projectData.dest}`;
                div5.innerHTML = `<b>Date of Travel:</b> ${projectData.dateValue}`;
            }
        } else {
            // this means some sort of error 
            div1.setAttribute('class','error') // creating class error for red color
            div1.innerHTML = `<b>${projectData.error}</b>`
            // setting all other divs to a blank value
            div2.innerHTML = ``;
            div3.innerHTML = ``;
            div4.innerHTML = ``;
            div5.innerHTML = ``;                    
        }
        
    }  catch(error) {
        //console.log("error", error);
        updateUIError(error);
    }    
}

// Below funciton will update ui properly incase of some error from any function (error which is not part of projectDta returned by the main function above)
const updateUIError = (error)=>{
    document.getElementsByClassName('bar-container active')[0].remove(); //removal of progress bar
    //getting all the divs where data needs to be populated
    let div1 = document.getElementById('countryName');
    let div2 = document.getElementById('lat');
    let div3 = document.getElementById('lng');
    let div4 = document.getElementById('dest');
    let div5 = document.getElementById('travelDate');
    div1.setAttribute('class','error') // creating class error for red color
    div1.innerHTML = `<b>${error}</b>`
    // setting all other divs to a blank value
    div2.innerHTML = ``;
    div3.innerHTML = ``;
    div4.innerHTML = ``;
    div5.innerHTML = ``;
}

/* exporting it for webpack
export { getAylienURLInfo };
export { openAylienClassifyApi };
export { updateUI };
export { updateUIError };*/

  
