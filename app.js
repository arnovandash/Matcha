var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var util = require('util');
var exphbs = require('express-handlebars');
var routes = require('./routes');
var user = require('./user');
var email = require('./email');
var app = express();
var hbs = exphbs.create({
	extname: '.hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(session({
    secret: 'Ilivellamas',
    resave: true,
    saveUninitialized: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/javascripts', express.static(path.join(__dirname, 'public/javascripts')));
app.use('/stylesheets', express.static(path.join(__dirname, 'public/stylesheets')));
app.use('/material', express.static(path.join(__dirname, 'public/material')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/', routes);

//user.add('yolo2', 'Yolo', 'Swaggins', 'O', '010', 1477660696, 'yoloswaggins@mailinator.com', 'asdf');
//user.users();
//user.login('yolo21', 'asdf');
//email.send('yoloswaggins@mailinator.com', 'sup nigga', '<h1>You say what? MOFO?</h1>');
//email.sendConfirm('yoloswaggins@mailinator.com', 'yoloswaggins', 'http://localhost:8080', null);

module.exports = app;