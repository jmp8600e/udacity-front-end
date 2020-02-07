// use of dotenv as require
const dotenv = require('dotenv')
dotenv.config()

var path = require('path')
const express = require('express')

const app = express()

/* Dependencies */
const bodyParser = require('body-parser')
/* Middleware*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

app.use(express.static('dist'))

console.log(__dirname)

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

// designates what port the app will listen to for incoming requests
const port = 3001;
/* Spin up the server*/
const server = app.listen(port, listening);
 function listening(){
    // console.log(server);
    console.log(`running on localhost: ${port}`);
  };

let destData = {}; //initializing dictionary 

// node-fetch is working properly as it suports async, await 
const fetch = require("node-fetch");

// async geonames api call function
const geonamesApi = async (url) => {
    try {
        const response = await fetch(url);
        const geonamesData = await response.json();
        if (geonamesData.totalResultsCount === 0){
            destData = {};
            destData.totalResultsCount = 0;
        } else {
            destData = {};
            destData.totalResultsCount = geonamesData.totalResultsCount;
            destData.lng = geonamesData.geonames[0].lng;
            destData.lat = geonamesData.geonames[0].lat;
            destData.countryName = geonamesData.geonames[0].countryName
        }    
        return destData;
    }
    catch (error) {
        destData.error = error;
        return destData;
    }
}

// async darksky api call function  
const darkskyApi = async (destData) => {
    try {
        const url = 'https://api.darksky.net/forecast'; //holds darksky initial url
        const apikey = process.env.API_KEY_DarkSky; //getting key from .env file
        let fullurl
        if(destData.travelDateGtSeven == 0){
            //if travel within seven days from today...
            fullurl = `${url}/${apikey}/${destData.lat},${destData.lng}?exclude=minutely,hourly,flags` // creating full url
        }
        else {
            //if travel after seven days from today...
            fullurl = `${url}/${apikey}/${destData.lat},${destData.lng},${destData.travelDateGtSeven}?exclude=minutely,hourly,flags`
        }  
        const response = await fetch(fullurl);
        const darkskyData = await response.json();        
        if (darkskyData.code == 400){
            // nothing found from darkSky API
            destData.darkskycode = 400;
        } 
        else {
            destData.TZ = darkskyData.timezone;
            destData.dailySummary = darkskyData.daily.summary;
            let dailyInfo = []; //creating empty array
            for (const day of darkskyData.daily.data) {
               //populating empty array with dictionary data
              dailyInfo.push({
                    "time": day.time,
                    "summary": day.summary,
                    "icon": day.icon,
                    "sunriseTime": day.sunriseTime,
                    "sunsetTime": day.sunsetTime,
                    "precipProbability": day.precipProbability,
                    "temperatureHigh": day.temperatureHigh,
                    "temperatureLow": day.temperatureLow,
                    "humidity": day.humidity,
              });             
            }    
            destData.daily = dailyInfo;
        }    
        return destData;
    }
    catch (error) {
        destData.error = error;
        return destData;
    }   
}

// async pixabay api call function
const pixabayApi = async (destInfo,destData) => {
    try{
        const url = 'https://pixabay.com/api/?key='; //holds pixabay initial url
        const apikey = process.env.API_KEY_Pixabay; //getting key from .env file   
        let fullurl = `${url}${apikey}&q=${destInfo}&image_type=photo&orientation=horizontal&category=travel`
        const response = await fetch(fullurl);
        const pixabayData = await response.json();   

        if (pixabayData.totalHits > 0){
            // if data found
            let weburl = pixabayData.hits[0].webformatURL;
            destData.imgURL = weburl.replace('640.', '340.');
        }
        else{
            //if no data found make the code to 400 (not found)
            destData.pixabaycode = 400;
        }
        return destData;
    }
    catch (error) {
        destData.error = error;
        return destData;        
    }
    
}

//Geonames API endpoint
app.get('/getDestData/:destInfo/:travelDate', function (req, res) {   
    const url = 'http://api.geonames.org/searchJSON?q=' // this remains constant
    let destInfo = `${req.params.destInfo}`;  
    let travelDate = `${req.params.travelDate}`; //this is in GMT
    let today = new Date(); // geting today's current time
    let todayDate = (new Date(today.getFullYear(),today.getMonth(),today.getDate()).getTime() / 1000) - (today.getTimezoneOffset()*60)// getting today's date in GMT hence offset subtracted from the date this is bit complicated
    const username = process.env.USERNAME_GeoNames; // getting this from .env file
    const fullurl = `${url}${destInfo}&maxRows=1&username=${username}` // creating full url
    let destData = {};//initializing empty directory
    
    //calling async function to get data from geonames
    geonamesApi(fullurl).then(function(destData){
        if(destData.totalResultsCount > 0){
            // only make calls to other APIs if geonamesapi returns results
            if (((travelDate - todayDate)/86400) > 7){
                destData.travelDateGtSeven = travelDate; // this is needed to conver to GMT                
                darkskyApi(destData).then(function(destData){
                   destData.travelDateEpoch = travelDate; // this is needed in order to tell which day to display on the UI +s convers string to numbers
                   //finally call pixabayApi
                   pixabayApi(destInfo,destData).then(function(destData){res.send(destData);})                    
                })
            }
            else if (((travelDate - todayDate)/86400) < 0){
                destData.travelDateGtSeven = -1;
                res.send(destData); 
            }
            else {
                destData.travelDateGtSeven = 0;
                darkskyApi(destData).then(function(destData){
                   destData.travelDateEpoch = travelDate; // this is needed in order to tell which day to display on the UI
                   //finally call pixabayApi
                   pixabayApi(destInfo,destData).then(function(destData){res.send(destData);})
                })
                
            }
        }
        else{
            // if no results are coming back from geonamesapi then just send the data as is
            res.send(destData);
        }
    });
});


