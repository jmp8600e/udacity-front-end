# Project: Evaluate News Article with NLP

This NLP project is completed as per the project rubrics. This web application uses webpack. The web page  has two sections as shown below. Please check prerequisite sections to start the application. 

### Section 1: URL Classification
- Takes a website url, it also checks for proper URL format and it will not take incorrect URL. 
- After user hit GO!, the application will connect to Aylien URL Classification API and and will provide some information right below the submit form. 
- If there is an issue it will show an error instead of content coming from the API.

### Section 2: Sentiment Analysis
- Takes a sentance, it also checks for proper sentance format before accepting. 
- After user hit GO!, the application will connect to Aylien Sentiment Analysis API and and will provide some information right below the submit form regarding the sentance entered. 
- If there is an issue it will show an error instead of content coming from the API.
 

## Grader Access info    
- Download the complete project from the github 
- Please check prerequisite section for all node, webpack and other dependancy  
- open browser and use URL http://localhost:8081/ (PROD) to open the application

## Prerequisite
- Node must be installed, please make sure to install node from https://nodejs.org/en/download/ base on OS platform you are using
- Rest of the node modules are part of the git repo so everything should work. Following node modules were installed using npm command. 
   - npm install express
   - npm install body-parser
   - npm install cors
   - npm install
   - npm install webpack webpack-cli --save-dev
   - npm install express
   - npm install -D webpack-dev-server
   - npm install AYLIEN/aylien_newsapi_nodejs
   - npm install aylien_textapi
   - npm install aylien-news-api
   - npm install dotenv
   - npm install -D @babel/core @babel/preset-env babel-loader
   - npm install -D html-webpack-plugin
   - npm install -D clean-webpack-plugin
   - npm install -D style-loader
   - npm install -D css-loader
   - npm install -D file-loader
   - npm install body-parser
   - npm install cors
   - npm install --save-dev jest
   - npm install workbox-webpack-plugin --save-dev
   - npm i -D style-loader node-sass css-loader sass-loader
-  The .env file must be present at the root of the project which should have Aylien API keys like below:
```
API_ID=**************************
API_KEY=**************************
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

The test only works when following line is uncommented from the **aylienTXT.js** script. Make sure to comment the line out **otherwise** webpack will create faulty code unhder dist folder. I had long messages with the mentor but she is not able to figure this issue and even I cannot. 
```
module.exports = testapi;
```

### Third-Party Resources
- Research based resources
    - https://stackoverflow.com
    - https://w3schools.com
    - https://developer.mozilla.org/
    - https://dillinger.io

Thanks,
Jatin

