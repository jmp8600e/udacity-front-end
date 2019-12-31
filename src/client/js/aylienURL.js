//start of Aylien API call
const getAylienURLInfo = ()=>{
    let url = encodeURIComponent(document.getElementById("urlValue").value) //get the form value and properly enconde it as browser url
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
    openAylienClassifyApi(url).then(function(projectData){
        //updateUI after successfull execution of POST data
        document.getElementsByClassName('bar-container active')[0].remove(); //removal of progress bar
        updateUI(projectData);
    }).catch(function(error){
        // incase error from the Aylien API show a message on the UI that error has occured
        updateUIError(error);
      });

   return false; // this is very important otherwise user will be moved away from the current page
}


// get data from node endpoint getURLClassification - this is async function
const openAylienClassifyApi = async (url)=>{
    let apiUrl = 'http://localhost:8080/getURLClassification' // holding initial part of api url for Aylien classify API
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
const updateUI = (projectData) => {
    try {
        //getting all the divs where data needs to be populated
        let divlang = document.getElementById('lang');
        let divconfident = document.getElementById('confident');
        let divscore = document.getElementById('score');
        let divl1 = document.getElementById('l1');
        let divl2 = document.getElementById('l2');
        
        // if error is not there in the data
        if(!projectData.error){
        divlang.innerHTML = `<b>Language:</b> ${projectData.language}`;
        if(divlang.hasAttribute('class')){
            divlang.removeAttribute('class'); // removal of class to remove red color
        }
        divconfident.innerHTML = `<b>Confident:</b> ${projectData.confident}`;
        divscore.innerHTML = `<b>Score:</b> ${projectData.score}`;
        divl1.innerHTML = `<b>Label 1:</b> ${projectData.label1}`;
        divl2.innerHTML = `<b>Label 2:</b> ${projectData.label2}`;
        } else {
            // this means some sort of error 
            divlang.setAttribute('class','error') // creating class error for red color
            divlang.innerHTML = `<b>${projectData.error}</b>`
            // setting all other divs to a blank value
            divconfident.innerHTML = ``;
            divscore.innerHTML = ``;
            divl1.innerHTML = ``;
            divl2.innerHTML = ``;                    
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
    let divlang = document.getElementById('lang');
    let divconfident = document.getElementById('confident');
    let divscore = document.getElementById('score');
    let divl1 = document.getElementById('l1');
    let divl2 = document.getElementById('l2');
    divlang.setAttribute('class','error') // creating class error for red color
    divlang.innerHTML = `<b>${error}</b>`
    // setting all other divs to a blank value
    divconfident.innerHTML = ``;
    divscore.innerHTML = ``;
    divl1.innerHTML = ``;
    divl2.innerHTML = ``;
}


  
