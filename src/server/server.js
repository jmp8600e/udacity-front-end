/* pre req:
npm install body-parser
npm install express
npm install cors
npm install node-fetch
npm install dotenv
*/
// use of dotenv as require
const dotenv = require('dotenv')
dotenv.config()


/* Express to run server and routes */
const express = require('express');

/* Start up an instance of app */
const app = express();

/* Dependencies */
const bodyParser = require('body-parser')
/* Middleware*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

/* Initialize the main project folder, this will serve index.html..*/
app.use(express.static('..'));

const port = 3001;
/* Spin up the server*/
const server = app.listen(port, listening);
 function listening(){
    // console.log(server);
    console.log(`running on localhost: ${port}`);
  };

const weatherData = [];

app.post('/addWeatherData', addWeatherData )

function addWeatherData (req, res){
   //console.log(req.body)
   weatherData.push(req.body);
   console.log(weatherData);
   res.send(req.body);
}

app.get('/projectData', function (req, res) {
  res.send(weatherData);
  console.log(weatherData);
  console.log(req.body);
});

let destData = {}; //initializing dictionary 

// does not work as expected....so moving to node-fetch
const request = require('request');

app.get('/getFromGeonames2', function (req, res) {    
   request('http://api.geonames.org/searchJSON?q=london%20England&maxRows=1&username=jmp8600e', { json: true }, (err, res2, body) => {
      if (err) { 
        cordinatesData.error = err;
      } else {    
        if (body.totalResultsCount === 0){
            cordinatesData.totalResultsCount = 0;
        } else {
            cordinatesData.totalResultsCount = body.totalResultsCount;
            cordinatesData.lng = body.geonames[0].lng;
            cordinatesData.lat = body.geonames[0].lat;
        }
      }
      res.send(cordinatesData);
    });    
});


// node-fetch is working properly as it suports async, await 
const fetch = require("node-fetch");

// async geonames api call function
const geonamesApi = async (url) => {
    try {
        const response = await fetch(url);
        const geonamesData = await response.json();
        //console.log(geonamesData);
        if (geonamesData.totalResultsCount === 0){
            destData = {};
            destData.totalResultsCount = 0;
        } else {
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

  
const darkskyApi = async (destData) => {
    try {
        const url = 'https://api.darksky.net/forecast'; //holds darksky initial url prepending by heroku so allows non-cors calls
        const apikey = process.env.API_KE_DarkSky;
        let fullurl
        if(destData.travelDateGtSeven == 0){
            fullurl = `${url}/${apikey}/${destData.lat},${destData.lng}?exclude=minutely,hourly,flags` // creating full url
        }
        else {
            fullurl = `${url}/${apikey}/${destData.lat},${destData.lng},${destData.travelDateGtSeven}?exclude=minutely,hourly,flags`
        }  
        const response = await fetch(fullurl);
        const darkskyData = await response.json();        
        if (darkskyData.code == 400){
            destData.darkskycode = 400;
        } 
        else {
            destData.TZ = darkskyData.timezone;
            destData.dailySummary = darkskyData.daily.summary;
            let dailyInfo = [];
            for (const day of darkskyData.daily.data) {
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

//Geonames API endpoint
app.get('/getFromGeonames/:destInfo/:travelDate', function (req, res) {   
    const url = 'http://api.geonames.org/searchJSON?q=' // this remains constant
    let destInfo = `${req.params.destInfo}`;  
    let travelDate = `${req.params.travelDate}`;
    let today = new Date(); // geting today's current time
    let todayDate = (new Date(today.getFullYear(),today.getMonth(),today.getDate()).getTime() / 1000) - (today.getTimezoneOffset()*60)// getting today's date in GMT hence offset subtracted from the date this is bit complicated

    const username = process.env.USERNAME_GeoNames; // getting this from .env file
    const fullurl = `${url}${destInfo}&maxRows=1&username=${username}` // creating full url
    //console.log(fullurl);
    //calling async function to get data from geonames
    geonamesApi(fullurl).then(function(destData){
        //destData = geonamesData;
        if (((travelDate - todayDate)/86400) > 7){
            destData.travelDateGtSeven = travelDate;
            darkskyApi(destData).then(function(destData){
               res.send(destData); 
            })
        }
        else if (((travelDate - todayDate)/86400) < 0){
            destData.travelDateGtSeven = -1;
        }
        else {
            destData.travelDateGtSeven = 0;
            darkskyApi(destData).then(function(destData){
               res.send(destData); 
            })
            
        }
        //res.send(destData);
    });
});


