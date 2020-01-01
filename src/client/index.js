import { getAylienURLInfo } from './js/aylienURL'
import { openAylienClassifyApi } from './js/aylienURL'
import { updateUI } from './js/aylienURL'
import { updateUIError } from './js/aylienURL'

import './styles/main.css'
import './styles/form.css'
import './styles/footer.css'
import './styles/header.css'


// below are exported because output in webpack.dev/pord.js can use it
export {
    getAylienURLInfo,
    openAylienClassifyApi,
    updateUI,
    updateUIError
}

