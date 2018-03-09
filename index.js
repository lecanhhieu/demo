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
const passsport = require('passport');
const expressValidator = require('express-validator');
const favicon = require('serve-favicon');

const config = require ('./config/database');

const routes = require('./routes'); //Cai này nó mặc đinh lấy file nào trên index trong thu muc.


const app = express();
app.use(expressValidator()); 

mongoose.connect(config.database);
let db = mongoose.connection;

db.once('open', function(){
  console.log('Connected to MongoDB');
  
});

db.on('error',function(err){
  console.log(err);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(errorHandler());

//  Connect all our routes to our application
app.use('/', routes);

app.get('/',function(req,res){
  res.render('hello',{messages: {}})
})

// let users = require('./routes/users');
// app.use('/users', users);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use(function(err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//Cai nay phai de cuoi cung.
app.set('port', process.env.PORT || 8080)
app.listen(app.get('port'), function(){console.log(`app is running on port ${app.get('port')}`)})

module.exports = app;
