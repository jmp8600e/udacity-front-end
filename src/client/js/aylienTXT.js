//start of Aylien API call
const getAylienTXTInfo = ()=>{
    let url = encodeURIComponent(document.getElementById("txtValue").value) //get the form value and properly enconde it as browser url
    // below four lines for progress bar
    let container = document.getElementsByClassName('container2')[0];
    let progressBar = document.getElementsByClassName("bar-container2")[0];
    let newProgressBar = progressBar.cloneNode(true);
    container.appendChild(newProgressBar);
    // 10 secs for progress bar
    setTimeout(function() {
        newProgressBar.classList.add('active');
        setTimeout(function() {
           
        }, 10000);
    }, 0);
    // calling openAylienClassifyApi function, chained promises which gets API data and updates the UI
    Client.openAylienTXTApi(url).then(function(projectData){
        //updateUI after successfull execution of POST data
        document.getElementsByClassName('bar-container2 active')[0].remove(); //removal of progress bar
        Client.updateUI2(projectData);
    }).catch(function(error){
        // incase error from the Aylien API show a message on the UI that error has occured
        Client.updateUIError2(error);
      });

   return false; // this is very important otherwise user will be moved away from the current page
}


// get data from node endpoint getURLClassification - this is async function
const openAylienTXTApi = async (url)=>{
    let apiUrl = 'http://localhost:8081/getTXTSentiment' // holding initial part of api url for Aylien classify API
    let fullUrl = `${apiUrl}/${url}`; //creating full API url
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
const updateUI2 = (projectData) => {
    try {
        //getting all the divs where data needs to be populated
        let divpolarity = document.getElementById('polarity');
        let divsub = document.getElementById('subjectivity');
        let divpolconf = document.getElementById('polarity_confidence');
        let divlsbjecconf = document.getElementById('subjectivity_confidence');
        
        // if error is not there in the data
        if(!projectData.error){
        divpolarity.innerHTML = `<b>Language:</b> ${projectData.language}`;
        if(divpolarity.hasAttribute('class')){
            divpolarity.removeAttribute('class'); // removal of class to remove red color
        }
        divpolarity.innerHTML = `<b>Polarity:</b> ${projectData.polarity}`;
        divsub.innerHTML = `<b>Subjectivity:</b> ${projectData.subjectivity}`;
        divpolconf.innerHTML = `<b>Polarity Confidence:</b> ${projectData.polarity_confidence}`;
        divlsbjecconf.innerHTML = `<b>Subjectivity Confidence:</b> ${projectData.subjectivity_confidence}`;
        } else {
            // this means some sort of error 
            divpolarity.setAttribute('class','error') // creating class error for red color
            divpolarity.innerHTML = `<b>${projectData.error}</b>`
            // setting all other divs to a blank value
            divsub.innerHTML = ``;
            divpolconf.innerHTML = ``;
            divlsbjecconf.innerHTML = ``;                    
        }
        
    }  catch(error) {
        //console.log("error", error);
        Client.updateUIError2(error);
    }    
}

// Below funciton will update ui properly incase of some error from any function (error which is not part of projectDta returned by the main function above)
const updateUIError2 = (error)=>{
    document.getElementsByClassName('bar-container2 active')[0].remove(); //removal of progress bar
    //getting all the divs where data needs to be populated
    let divpolarity = document.getElementById('polarity');
    let divsub = document.getElementById('subjectivity');
    let divpolconf = document.getElementById('polarity_confidence');
    let divlsbjecconf = document.getElementById('subjectivity_confidence');
    divpolarity.setAttribute('class','error') // creating class error for red color
    divpolarity.innerHTML = `<b>${error}</b>`
    // setting all other divs to a blank value
    divsub.innerHTML = ``;
    divpolconf.innerHTML = ``;
    divlsbjecconf.innerHTML = ``;
}

  
//jest  test function

function testapi(url){
    return openAylienTXTApi(url).length;
}

// comment below line when doing a webpack build as it breaks webpack, uncomment while performing jest test
module.exports = testapi;


// exporting it for webpack
export { getAylienTXTInfo };
export { openAylienTXTApi };
export { updateUI2 };
export { updateUIError2 };


