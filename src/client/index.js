import { getDestinationInfo } from './js/destInfo'
import { getDestinationData } from './js/destInfo'
import { updateUI } from './js/destInfo'
import { updateUIError } from './js/destInfo'

import './styles/main.scss'
import './styles/form.scss'
import './styles/footer.scss'
import './styles/header.scss'


//const pathToSleet = require('./img/sleet.png');

//const getSleet = () => `<img src='${pathToSleet}' alt='sleet    ' />`;


const pathToImages = require.context('./img', true);
// true here is for use subdirectories, you can also specify regex as third param

const images = [
    'clear-day.png',
    'clear-night.png',
    'cloudy.png',
    'fog.png',
    'img-not-found.png',
    'partly-cloudy-day.png',
    'partly-cloudy-night.png',
    'rain.png',
    'sleet.png',
    'snow.png',
    'wind.png'    
];

const getImages = () => images.map(name => `<img src='${pathToImages(name, true)}' alt='${name}' />`);

// below are exported because output in webpack.dev/pord.js can use it
export {
    getDestinationInfo,
    getDestinationData,
    updateUI,
    updateUIError  
}

