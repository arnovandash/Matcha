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
var mongo = require('./myMongo');
var app = express();
var hbs = exphbs.create({
    extname: '.hbs',
    helpers: {
        angular: function(options) {
            return options.fn();
        }
    }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(session({
    secret: 'Ilivellamas',
    resave: true,
    saveUninitialized: false
}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
    extended: false,
    limit: '50mb'
}));
app.use(cookieParser());

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/javascripts', express.static(path.join(__dirname, 'public/javascripts')));
app.use('/stylesheets', express.static(path.join(__dirname, 'public/stylesheets')));
app.use('/material', express.static(path.join(__dirname, 'public/material')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/', routes);

//user.add('yolo2', 'Yolo', 'Swaggins', 'O', '010', 1477660696, 'yoloswaggins@mailinator.com', 'asdf');
//user.listAll();
//user.login('yolo21', 'asdf');
/*user.get('581df7beec34b159a4cb1870', function(result) {
	console.log(result);
}); */
/*user.findMatches('581f1204a868f311f1f24a26', function(result) {
	console.log(require('util').inspect(result, { depth: null }));
}); */
/*user.getRecomendations('581f1204a868f311f1f24a26', function(result) {
	console.log(require('util').inspect(result, { depth: null }));
}); */
//mongo.update('users', {username: 'nigel23'}, {$set: {username: 'nigel2'}}, function(result) {console.log(result);});
//email.send('yoloswaggins@mailinator.com', 'sup nigga', '<h1>You say what? MOFO?</h1>');
//email.sendConfirm('yoloswaggins@mailinator.com', 'yoloswaggins', 'http://localhost:8080', null);

module.exports = app;