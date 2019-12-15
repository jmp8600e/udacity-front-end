//start of getting weather info
const getWeatherInfo = ()=>{
    let zipCode = document.getElementById("zip").value
    let feelings = document.getElementById("feelings").value
    // making sure that both fields are provided before moving forward
    if (zipCode == "" || feelings =="") {
        alert("zipcode and Feelings must be filled out");
    } else {
        const appId = 'APPID=81ab9519a11e3f57765554bfd777ed5b' // storing Appid created for OpenWeatherAPI
        // calling openWeatherApi function, chained promises which gets API data, POSTs data to the server.js endpoing and finally updates the UI
        openWeatherApi(zipCode,appId).then(function(projectData){
            projectData.feelings = feelings; // adding feelings to the data that came from OpenWeatherAPI
            // now postind data to addWeatherData created in server.js after successfull execution from OpenWeatherAPI function
            postData('/addWeatherData', projectData).then(function(data){
                //updateUI after successfull execution of POST data
                updateUI('/projectData',data.zip, data.date)
            });
        }).catch(function(error){
            // incase error from the GetWeatherAPI show a message on the UI that error has occured
            updateUIError();
          });
    }
    
}

// get data frpm OpenWeatherAPI this is async function
const openWeatherApi = async (zipCode, appId)=>{
    let apiUrl = 'http://api.openweathermap.org/data/2.5/weather?' // holding initial part of api url for openweathermap
    let fullUrl = `${apiUrl}zip=${zipCode}&units=imperial&${appId}`; //creating full API url based on zip code provided
    const weatherData = await fetch(fullUrl); // awaiting to get the data
     try{
            const data = await weatherData.json();   //awaiting to convert to json format
            // only get data if return code is 200 otherwise error will be returned
            if(data['cod'] == 200){
                let date = new Date(0); //getting start of epoch time
                date.setUTCSeconds(data['dt']); //getting proper readable time format  in local zone
                projectData = {zip:`${zipCode}`,temprature:`${data['main']['temp']}`, date:`${date}`}; 
                return projectData;
            }    
        }catch(error) {            
          console.log("error", error);
          return error;
        }
    
    
}

// below dynamically updates UI - this is async function
const updateUI = async (baseURL, zipCode, date)=>{
    const res = await fetch(baseURL);  // awaiting to get the data
    try {
    let temp;
    let feelings;
    let divdate = document.getElementById('date'); // getting date div
    let divtemp = document.getElementById('temp'); // getting temp dic
    let divcontent = document.getElementById('content'); //getting content div
    const data = await res.json(); //awaiting to convert to json format
    // below for look gets proper data from the stored data in case there are multiple zip codes with same values stored 
    for (let i=0; i < data.length; i++){
        if (data[i].zip == zipCode && data[i].date == date){
            temp = data[i].temprature;
            feelings = data[i].feelings;
        }        
    divdate.innerHTML = `<b>Date:</b> ${date}`;
    divtemp.innerHTML = `<b>Temprature:</b> ${temp} &#8457;`;
    divcontent.innerHTML = `<b>Feelings:</b> ${feelings}`;
    }
    }  catch(error) {
    console.log("error", error);
    // appropriately handle the error
    }    
}

const updateUIError = ()=>{
    let divdate = document.getElementById('date'); // getting date div
    let divtemp = document.getElementById('temp'); // getting temp dic
    let divcontent = document.getElementById('content'); //getting content div
    divdate.innerHTML = 'Either incorrect Zip Code(most likely) or other errors'
    divtemp.innerHTML = ``;
    divcontent.innerHTML = ``;
}

// Button click listner with id of generate
let getButton = document.getElementById("generate");
getButton.addEventListener('click', getWeatherInfo);



// storing data -  this is async function
const postData = async ( url = '', data = {})=>{
      const response = await fetch(url, {
      method: 'POST', 
      credentials: 'same-origin',
      headers: {
          'Content-Type': 'application/json',
      },
     // Body data type must match "Content-Type" header        
      body: JSON.stringify(data), 
    });

      try {
        const data = await response.json();
        return data;
      }catch(error) {
      console.log("error", error);
      }
  }
  
