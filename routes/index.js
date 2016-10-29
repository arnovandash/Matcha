var express = require('express');
var session = require('express-session');
var user = require('../user');
var router = express.Router();

var sess;

/* GET home page. */
router.get('/', function(req, res, next) {
    sess = req.session;
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
});

/* GET users listing. */
/* another page route example
router.get('/users', function(req, res, next) {
  res.send('respond with a resource');
});
*/

router.get('/home', function(req, res) {
    sess = req.session;
    if (sess.user) {
        res.render('home', {
            user: sess.user
        });
    } else {
        res.redirect('/');
    }
});

router.post('/login', function(req, res) {
    sess = req.session;
    user.login(req.body.username, req.body.password, function(result) {
		sess.user = result;
		if (result) {
	        res.redirect('/home');
	    } else {
	        res.redirect('/');
	    }
	});
	console.log(sess.user);

});

module.exports = router;