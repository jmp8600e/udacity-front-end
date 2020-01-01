// use of dotenv as require
const dotenv = require('dotenv')
dotenv.config()

var path = require('path')
const express = require('express')
const mockAPIResponse = require('./mockAPI.js')

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
app.listen(8081, function () {
    console.log('Example app listening on port 8081!')
})

app.get('/test', function (req, res) {
    res.send(mockAPIResponse)
})



var aylien = require("aylien_textapi");

// set aylien API credentials from .env file
var textapi = new aylien({
  application_id: process.env.API_ID,
  application_key: process.env.APP_KEY
});

// aylien API for URL Classification
let urldata = {}; //initializing dictionary
app.get('/getURLClassification/:articleURL', function (req, res) {
    textapi.classifyByTaxonomy({
      'url': `${req.params.articleURL}`,  //getting URL value from the node call to the function. 
      'taxonomy': 'iab-qag'
    }, function(error, response) {
      if (error === null) {
        // no error so setting all needed values but 1st clearing the variable
        urldata = {};
        urldata.language = `${response['language']}`;  
        urldata.confident =  `${response['categories'][0]['confident']}`;
        urldata.score = `${response['categories'][0]['score']}`;
        urldata.label1 = `${response['categories'][0]['label']}`;
        urldata.label2 = `${response['categories'][1]['label']}`;
        res.send(urldata); //returning the data back to the caller
      } else {
            //this means somekind of error
            urldata = {}; // clearing the variable
            urldata.error = `${error}`; //adding the error data
            res.send(urldata); //returning the data back to the caller
      }
    });

});

// aylien API for sentance sentiment
let txtdata = {}; //initializing dictionary
app.get('/getTXTSentiment/:sentance', function (req, res) {
    textapi.sentiment({
      text: `${req.params.sentance}`, //getting URL value from the node call to the function.
      mode: 'tweet'
    }, function(error, response) {
      if (error === null) {
        // no error so setting all needed values but 1st clearing the variable
        urldata = {};
        txtdata.polarity = `${response['polarity']}`      
        txtdata.subjectivity =  `${response['subjectivity'][0]['confident']}`;
        txtdata.polarity_confidence = `${response['polarity_confidence']}`;
        txtdata.subjectivity_confidence = `${response['subjectivity_confidence']}`;
        res.send(txtdata);  //returning the data back to the caller        
      } else {
            //this means somekind of error
            txtdata = {}; // clearing the variable
            txtdata.error = `${error}`; //adding the error data
            res.send(txtdata); //returning the data back to the caller
      }
    });

});