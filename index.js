const express = require('express');
const multer = require('multer');
const pug = require('pug');
const mongoose = require('mongoose');
const flash = require('express-flash');
const session = require('express-session');
const errorHandler = require('errorhandler');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


const app = express();
app.listen(3000);
mongoose.Promise = global.Promise
const mongoDB = process.env.MONGODB_URI || 'mongodb://127.0.0.1/tutsplus-library'
mongoose.connect(mongoDB)


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(errorHandler());

app.get('/',function(req,res){
  res.render('home')
})

module.exports = app;
