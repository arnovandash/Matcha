var express = require('express');
var session = require('express-session');
var user = require('./user');
var router = express.Router();

var sess;

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: '{{ title }}'
	});
});

router.get('/partials/home', function(req, res, next) {
    sess = req.session;
	if (sess.user) {
		res.render('home', {
			user: sess.user
		});
	} else {
		res.render('register');
	}
});

router.get('/partials/license', function(req, res) {
	res.render('license');
});

router.post('/api/login', function(req, res) {
    sess = req.session;
    user.login(req.body.username, req.body.password, function(result) {
		sess.user = result;
		console.log('session user: ' + sess.user);
		res.json(result);
	});
});

router.post('/api/logout', function(req, res) {
	req.session.user = null;
	res.json(true);
});

router.post('/api/user_exists', function(req, res) {
	if (req.body.username) {
		user.checkUsername(req.body.username, function(result) {
			res.json(reslut);
		});
	} else {
		console.log('No username field');
		console.log(req);
		res.json(false);
	}
});

module.exports = router;