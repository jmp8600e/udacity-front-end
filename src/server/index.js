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
app.listen(8080, function () {
    console.log('Example app listening on port 8080!')
})

app.get('/test', function (req, res) {
    res.send(mockAPIResponse)
})



var aylien = require("aylien_textapi");

// set aylien API credentias
var textapi = new aylien({
  application_id: process.env.API_ID,
  application_key: process.env.APP_KEY
});

// use encodeURIComponent('https://www.cnet.com/roadshow/reviews/2020-honda-odyssey-review/')
//http://localhost:8080/getURLClassification2/https%3A%2F%2Fwww.cnet.com%2Froadshow%2Freviews%2F2020-honda-odyssey-review%2F
//http://localhost:8080/getURLClassification2/http%3A%2F%2Ftechcrunch.com%2F2015%2F07%2F16%2Fmicrosoft-will-never-give-up-on-mobile
let urldata = {};
app.get('/getURLClassification/:articleURL', function (req, res) {
    textapi.classifyByTaxonomy({
      'url': `${req.params.articleURL}`,
      'taxonomy': 'iab-qag'
    }, function(error, response) {
      if (error === null) {
        urldata.language = `${response['language']}`;  
        urldata.confident =  `${response['categories'][0]['confident']}`;
        urldata.score = `${response['categories'][0]['score']}`;
        urldata.label1 = `${response['categories'][0]['label']}`;
        urldata.label2 = `${response['categories'][1]['label']}`;
        res.send(urldata);
      } else {
            urldata = {};
            urldata.error = `${error}`;
            res.send(urldata);
      }
    });

});

//http://localhost:8080/getTXTSentiment/John%20is%20a%20very%20good%20football%20player
let txtdata = {};
app.get('/getTXTSentiment/:sentance', function (req, res) {
    textapi.sentiment({
      text: `${req.params.sentance}`,
      mode: 'tweet'
    }, function(error, response) {
      if (error === null) {
        txtdata.polarity = `${response['polarity']}`      
        txtdata.subjectivity =  `${response['subjectivity'][0]['confident']}`;
        txtdata.polarity_confidence = `${response['polarity_confidence']}`;
        txtdata.subjectivity_confidence = `${response['subjectivity_confidence']}`;
        res.send(txtdata);          
      } else {
            txtdata = {};
            txtdata.error = `${error}`;
            res.send(txtdata);
      }
    });

});