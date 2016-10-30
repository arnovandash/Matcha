var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');

var routes = require('./routes');
var user = require('./user');

var app = express();

// view engine setup
app.engine('hbs', hbs({
    extname: 'hbs'//,  DON'T REMOVE
    //defaultLayout: 'layout',  DON'T REMOVE
    //layoutsDir: __dirname + '/views/layouts/' DON'T REMOVE
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
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
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/javascripts', express.static(path.join(__dirname, 'public/javascripts')));
app.use('/stylesheets', express.static(path.join(__dirname, 'public/stylesheets')));
app.use('/material', express.static(path.join(__dirname, 'public/material')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


//user.add('yolo2', 'Yolo', 'Swaggins', 0, '010', 1477660696, 'yoloswaggins@mailinator.com', 'asdf');
//user.users();
//user.login('yolo21', 'asdf');

module.exports = app;