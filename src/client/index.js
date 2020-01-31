import { getAylienURLInfo } from './js/aylienURL'
import { openAylienClassifyApi } from './js/aylienURL'
import { updateUI } from './js/aylienURL'
import { updateUIError } from './js/aylienURL'
import { getAylienTXTInfo } from './js/aylienTXT'
import { openAylienTXTApi } from './js/aylienTXT'
import { updateUI2 } from './js/aylienTXT'
import { updateUIError2 } from './js/aylienTXT'

import './styles/main.scss'
import './styles/form.scss'
import './styles/footer.scss'
import './styles/header.scss'


// below are exported because output in webpack.dev/pord.js can use it
export {
    getAylienURLInfo,
    openAylienClassifyApi,
    updateUI,
    updateUIError,
    getAylienTXTInfo,
    openAylienTXTApi,
    updateUI2,
    updateUIError2   
}

