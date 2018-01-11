var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var helmet = require('helmet');
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var passport = require('passport');
var bcrypt = require('bcrypt');
var connectMongo = require('connect-mongo')(session);
var config = require('./config/config');
var crypto = require('crypto');
var async = require('async');
var nodemailer = require('nodemailer');
var moment = require('moment');
var multer = require('multer');
var fs = require('fs')
var index = require('./routes/index');

var app = express();
mongoose.Promise = global.Promise
//cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
//helmet setup
app.use(helmet());  
app.disable('x-powered-by');
// view engine setup
app.set('views', path.join(__dirname, 'build'));
app.set('view engine', "html");

app.engine('html', require('hbs').__express);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

if(process.env.PORT){
  app.use(session({
      secret: "somesecret",
      saveUninitialized: true,
      resave: true,
      store: new connectMongo({
          url: config.dbURL,
          stringify: true
      })
    }));
}else{
  app.use(session({
      secret: "somesecret",
      saveUninitialized: true,
      resave: true
    }));
}


app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});


app.use('/', index);

app.get('*',function(req, res){
  res.sendFile(path.join(process.cwd(),"build/index.html"))
});

// error handler
app.listen(process.env.PORT || 3001,()=>console.log("Server running on port 3001"));
module.exports = app;

