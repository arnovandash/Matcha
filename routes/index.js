var express = require('express');
var session = require('express-session');
var user = require('../user');
var router = express.Router();

var sess;

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

router.get('/home', function(req, res, next) {
    sess = req.session;
	if (sess.user) {
		res.render('home', {
			user: sess.user
		});
	} else {
		res.render('register');
	}
});

router.post('/login', function(req, res) {
    sess = req.session;
    user.login(req.body.username, req.body.password, function(result) {
		sess.user = result;
		console.log('session user: ' + sess.user);
		res.send(JSON.stringify(result));
	});
});

router.post('/logout', function(req, res) {
	req.session.user = null;
	res.send(JSON.stringify(true));
});

module.exports = router;