const dotenv = require('dotenv')
dotenv.config()
console.log(dotenv.config())
var path = require('path')
const express = require('express')
const mockAPIResponse = require('./mockAPI.js')

const app = express()

app.use(express.static('dist'))

console.log(__dirname)

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

// designates what port the app will listen to for incoming requests
app.listen(8080, function () {
    console.log('Example app listening on port 8080!')
})

app.get('/test', function (req, res) {
    res.send(mockAPIResponse)
})


console.log(process.env.APP_KEY);
console.log(process.env.API_ID);

var aylien = require("aylien_textapi");

// set aylien API credentias
var textapi = new aylien({
  application_id: process.env.API_ID,
  application_key: process.env.APP_KEY
});

/*textapi.sentiment({
  text: 'John is an asshole',
  mode: 'tweet'
}, function(error, response) {
  if (error === null) {
    console.log(response);
  }
});


textapi.entityLevelSentiment({
  text: 'Newark, New Jersey'
}, function(error, response) {
  if (error === null) {
    console.log(response);
    console.log("NEXT");
    console.log(response["entities"]);
    console.log("NEXT");
    console.log(response["entities"][0]);
    console.log("NEXT");
     console.log(response["entities"][0]["links"]);
  }
});

textapi.classify({
  url: 'https://www.cnet.com/news/galaxy-s11-rumors-and-leaks-feb-release-date-5g-ready-so-many-megapixels'
}, function(error, response) {
  if (error === null) {
    response['categories'].forEach(function(c) {
      console.log(c);
    });
  }
});

textapi.classifyByTaxonomy({
  'url': 'https://www.cnet.com/news/galaxy-s11-rumors-and-leaks-feb-release-date-5g-ready-so-many-megapixels',
  'taxonomy': 'iab-qag'
}, function(error, response) {
  if (error === null) {
    response['categories'].forEach(function(c) {
      console.log(c);
    });
  }
});*/

textapi.entityLevelSentiment({
  text: 'Barcelona is an awesome destination'
}, function(error, response) {
  if (error === null) {
    console.log(response);
    console.log("NEXT");
    console.log(response["entities"]);
    console.log("NEXT");
    console.log(response["entities"][0]);
    console.log("NEXT");
    console.log(response["entities"][0]["links"]);    
  }
});