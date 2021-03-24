require('dotenv').config();

const express = require('express');
const app = express();

const uri = String(process.env.CONNECTIONSTRING);

// MONGODB CONNECTION
const mongoose = require('mongoose');
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connection successful');
    app.emit('ready');
  })
  .catch(e => console.log(e));

// SESSION CONFIG
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const routes = require('./routes');
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const { globalMiddleware, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions = session({
  secret: 'azbycxdwevfugthsirjqkplomn1928374650',
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
});
app.use(sessionOptions);
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(csrf());

// Nossos próprios middlewares
app.use(globalMiddleware);

// CSRF SECUTIRY MIDDLEWARES
app.use(checkCsrfError);
app.use(csrfMiddleware);

// ROUTES
app.use(routes);

app.on('ready', () => {
  app.listen(3000, () => {
    console.log('server is running on port 3000');
    console.log('Access on http://localhost:3000');
  });
});
