const express = require('express');
const route = express.Router();

const home = require('./src/controllers/HomeController');
const login = require('./src/controllers/LoginController');
const contatos = require('./src/controllers/ContatosController');

const { loginRequired } = require('./src/middlewares/middleware')

route.get('/', home.index);

route.get('/login', login.index);
route.get('/logout', login.signout);
route.post('/login/signin', login.signin);
route.post('/login/signup', login.signup);
route.get('/contato', loginRequired, contatos.index);
route.get('/contato/:id', loginRequired, contatos.editIndex);
route.get('/contato/delete/:id', loginRequired, contatos.deleteContato);
route.post('/contato', loginRequired, contatos.registerNew);
route.post('/contato/edit/:id', loginRequired, contatos.editContato);

module.exports = route;
