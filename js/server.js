/* pre req:
npm install body-parser
npm install express
npm install cors
*/
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

const port = 3000;
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