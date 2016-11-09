var express = require('express');
var session = require('express-session');
var user = require('./user');
var router = express.Router();
var sess;

router.get('/partials/home', function(req, res) {
    sess = req.session;
    if (sess.user !== undefined && sess.user !== null) {
        res.render('home', sess.user);
    } else {
        res.render('register');
    }
});

router.get('/partials/account/:id?', function(req, res) {
    console.log(req.params.id);
    if (req.params.id === undefined) {
        sess = req.session;
        if (sess.user === undefined || sess.user === null) {
            res.send("Error: You need to be logged in");
        } else {
            user.find(sess.user.id, function(result) {
                result.mine = true;
                res.render('user_account', result);
            });
        }
    } else {
        if (!req.params.id.match(/[0-9A-Fa-f]{24}/)) {
            res.send("Error: no user of that id");
        } else {
            user.find(req.params.id, function(result) {
                if (result) {
                    result.mine = false;
                    res.render('user_account', result);
                } else {
                    res.json('no user of that id');
                }
            });
        }
    }
});

router.get('/partials/license', function(req, res) {
    res.render('license');
});

/***************************
 * NEED A PAGE FOR THIS!!! *
 ***************************/
router.get('/partials/confirm', function(req, res) {
    res.json('waiting...');
    //res.render('account');
});

router.get('/partials/send_reset', function(req, res) {
    res.render('send_reset');
});

router.get('/partials/reset', function(req, res) {
    res.render('reset');
});

router.post('/api/login', function(req, res) {
    user.login(req.body.username, req.body.password, function(result) {
        req.session.user = result;
        res.json(result);
    });
});

router.post('/api/whoami', function(req, res) {
    res.json(req.session.user);
});

router.post('/api/logout', function(req, res) {
    req.session.user = null;
    res.json(true);
});

/**************************************************************
 * Returns true if username is free, false if username exists *
 **************************************************************/
router.post('/api/check_username', function(req, res) {
    if (req.body.username) {
        user.checkUsername(req.body.username, function(result) {
            res.json(result);
        });
    } else {
        console.log('No username field');
        res.json(false);
    }
});

router.post('/api/check_email', function(req, res) {
    if (req.body.email) {
        user.checkEmail(req.body.email, function(result) {
            res.json(result);
        });
    } else {
        console.log('No email field');
        res.json(false);
    }
});

router.post('/api/register', function(req, res) {
    console.log(req.body);
    var r = req.body;
    user.add(r.username, r.firstname, r.lastname, r.gender, r.lookingFor, r.birthdate, r.email, r.password, function(result) {
        res.json(result);
    });
});

router.post('/api/confirm', function(req, res) {
    console.log(req.body);
    user.confirmEmail(req.body.link, function(result) {
        res.json(result);
    });
});

router.post('/api/send_reset', function(req, res) {
    user.sendReset(req.body.usernameEmail, function(result) {
        res.json(result);
    });
});

router.post('/api/reset', function(req, res) {
    user.confirmReset(req.body.link, req.body.password, function(result) {
        res.json(result);
    });
});

router.post('/api/set_location', function(req, res) {
    sess = req.session;
	if (sess.user !== undefined && sess.user !== null) {
		var r = req.body;
	    var location = {
	        latitude: r.latitude,
	        longitude: r.longitude
	    };
	    user.setLocation(location, sess.user.username, function(result) {
	        res.json(result);
	    });
	} else {
		res.json(false);
	}
});

router.post('/api/get_user', function(req, res) {
    if (req.body.id === undefined) {
        res.json(false);
    } else {
        if (!req.body.id.match(/[0-9A-Fa-f]{24}/)) {
            res.json(false);
        } else {
            user.get(req.body.id, function(result) {
                res.json(result);
            });
        }
    }
});

router.post('/api/modify', function(req, res) {
    var values = req.body.update;
    sess = req.session;
    if (sess.user === undefined || sess.user === null || values === undefined) {
        res.json('Values undefined');
    } else {
        values.id = sess.user.id;
        user.modify(values, function(result) {
            res.json(result);
        });
    }
});

/********************************************************
 * Has to be last route. Do not put any code under this *
 ********************************************************/
router.get('*', function(req, res) {
    res.render('index');
});

module.exports = router;