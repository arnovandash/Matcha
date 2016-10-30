var express = require('express');
var session = require('express-session');
var user = require('./user');
var router = express.Router();

var sess;

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

router.get('/partials/home', function(req, res, next) {
    sess = req.session;
	console.log(sess);
	if (sess.user) {
		res.render('home', {
			user: sess.user
		});
	} else {
		res.render('register');
	}
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

module.exports = router;