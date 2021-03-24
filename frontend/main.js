import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './assets/css/style.css';

import Validator from './modules/SignValidator';

const loginValidator = new Validator(document.querySelector('.form-login'));
const signupValidator = new Validator(document.querySelector('.form-signup'));

console.log('Hello world');
