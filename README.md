# Project: FEND Capstone (Travel Planner/Companion)

This FEND Capstone  project is completed as per the project rubrics. This web application uses webpack. The web page asks for Destination information and date of travel. It then displays proper information as require by the project. Please check prerequisite sections to start the application. The application is created as per minimum requirements and I am working on adding more advanced features. These advanced features, I am not able to implement due to time constrain. 

## Grader Access info    
- Download the complete project from the github 
- Please check prerequisite section for all node, webpack and other dependancy  
- open browser and use URL http://localhost:3001/ (PROD) to open the application

## Prerequisite
- Node must be installed, please make sure to install node from https://nodejs.org/en/download/ base on OS platform you are using
- Rest of the node modules are part of the git repo so everything should work. Following node modules were installed using npm command. 
   - npm install express
   - npm install body-parser
   - npm install cors
   - npm install node-fetch
   - npm install dotenv
   - npm install -D webpack-dev-server
   - npm install -D @babel/core @babel/preset-env babel-loader
   - npm install -D html-webpack-plugin
   - npm install -D clean-webpack-plugin
   - npm install -D style-loader
   - npm install -D css-loader
   - npm install -D file-loader
   - npm install --save-dev jest
   - npm install workbox-webpack-plugin --save-dev
   - npm i -D style-loader node-sass css-loader sass-loader   

-  The .env file **MUST** be present at the root of the project which should have username for **GeoNames API, API Key for DarkSky and API key for Pixabay PLEASE**:
```
USERNAME_GeoNames=**************************
API_KEY_DarkSky=**************************
API_KEY_Pixabay=**************************
```

## Running webpack build commmands

**Run following commands to run prod build and then start the prod app**
```
npm run build-prod
npm start
```
Open browser and hit url http://localhost:8081/

**Open another window and run following command to run webpack dev server**
```
npm run build-dev
```

## JEST Testing

Run following command to perform a test. 
```
npm run test
```

The test only works when following line is uncommented from the **destInfo.js** script. Make sure to comment the line out **otherwise** webpack will create faulty code unhder dist folder. I had long messages with the mentor but she is not able to figure this issue and even I cannot. 
```
module.exports = testapi;
```

### Third-Party Resources
- Research based resources
    - https://stackoverflow.com
    - https://w3schools.com
    - https://developer.mozilla.org/
    - https://dillinger.io
    - http://api.geonames.org
    - https://darksky.net/dev/docs
    - https://pixabay.com/api/docs/
    - https://www.epochconverter.com/

Thanks,
Jatin

