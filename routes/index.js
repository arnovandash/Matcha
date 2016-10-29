var express = require('express');
var session = require('express-session');
var user = require('../user');
var router = express.Router();

var sess;

/* GET home page. */
router.get('/', function(req, res, next) {
    sess = req.session;
	if (sess.user) {
		res.render('home', {
			user: sess.user
		});
	} else {
		res.render('index', {
	        title: 'Express',
	        user: false,
	        info: {
	            likes: 1,
	            dislikes: 2,
	            liked: 3
	        },
	        numbers: [1, 2, 3, 4, 5]
	    });
	}
});

router.post('/login', function(req, res) {
    sess = req.session;
    user.login(req.body.username, req.body.password, function(result) {
		sess.user = result;
		res.redirect('/');
		console.log('session user: ' + sess.user);
	});
});

router.post('/logout', function(req, res) {
	req.session.user = null;
});

module.exports = router;