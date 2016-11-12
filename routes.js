var express = require('express');
var session = require('express-session');
var user = require('./user');
var mkdirp = require('mkdirp');
var fs = require('fs');
var path = require('path');
var router = express.Router();
var sess;

router.get('/partials/home', function (req, res) {
    sess = req.session;
    if (sess.user !== undefined && sess.user !== null) {
        res.render('home', sess.user);
    } else {
        res.render('register');
    }
});

router.get('/partials/account/:id?', function (req, res) {
    console.log("going to account");
    console.log(req.params.id);
    sess = req.session;
    if (req.params.id === undefined) {
        if (sess.user === undefined || sess.user === null) {
            res.send("Error: You need to be logged in");
        } else {
            console.log("going to mine");
            user.find(sess.user.id, function (result) {
                result.mine = true;
				result.username = sess.user.username;
				result.id = sess.user.id;
                res.render('other_account', result);
            });
        }
    } else {
        if (!req.params.id.match(/[0-9A-Fa-f]{24}/)) {
            res.send("Error: no user of that id");
        } else {
            user.find(req.params.id, function (result) {
                if (result) {
                    console.log("going to other");
                    result.mine = false;
                    result.username = sess.user.username;
					result.user = sess.user;
                    res.render('other_account', result);
                } else {
                    res.json('no user of that id');
                }
            });
        }
    }
});

router.get('/partials/chat/:id?', function (req, res) {
    console.log(req.session.user);
    res.render('chat', req.session.user);
});


router.get('/partials/license', function (req, res) {
    res.render('license', req.session.user);
});

/***************************
 * NEED A PAGE FOR THIS!!! *
 ***************************/
router.get('/partials/confirm', function (req, res) {
    res.json('waiting...');
    //res.render('account');
});

router.get('/partials/send_reset', function (req, res) {
    res.render('send_reset');
});

router.get('/partials/reset', function (req, res) {
    res.render('reset');
});

router.post('/api/login', function (req, res) {
    user.login(req.body.username, req.body.password, function (result) {
        req.session.user = (typeof result === 'object') ? result : null;
        res.json(result);
    });
});

router.post('/api/whoami', function (req, res) {
    res.json(req.session.user);
});

router.post('/api/logout', function (req, res) {
    req.session.user = null;
    res.json(true);
});

router.post('/api/photo', function(req, res){
    console.log(req.body.uid);
    var dir = path.join(__dirname, 'public', 'uploads', req.body.uid + '.png');
    console.log(dir);
    fs.writeFile(dir, req.body.data, {encoding: 'base64'}, function(result) {
            res.json(result);
    });
});

/**************************************************************
 * Returns true if username is free, false if username exists *
 **************************************************************/
router.post('/api/check_username', function (req, res) {
    if (req.body.username) {
        user.checkUsername(req.body.username, function (result) {
            res.json(result);
        });
    } else {
        console.log('No username field');
        res.json(false);
    }
});

router.post('/api/check_email', function (req, res) {
    if (req.body.email) {
        user.checkEmail(req.body.email, function (result) {
            res.json(result);
        });
    } else {
        console.log('No email field');
        res.json(false);
    }
});

router.post('/api/register', function (req, res) {
    console.log(req.body);
    var r = req.body;
    user.add(r.username, r.firstname, r.lastname, r.gender, r.lookingFor, r.birthdate, r.email, r.password, function (result) {
        res.json(result);
    });
});

router.post('/api/confirm', function (req, res) {
    console.log(req.body);
    user.confirmEmail(req.body.link, function (result) {
        res.json(result);
    });
});

router.post('/api/send_reset', function (req, res) {
    user.sendReset(req.body.usernameEmail, function (result) {
        res.json(result);
    });
});

router.post('/api/reset', function (req, res) {
    user.confirmReset(req.body.link, req.body.password, function (result) {
        res.json(result);
    });
});

router.post('/api/set_location', function (req, res) {
    sess = req.session;
    if (sess.user !== undefined && sess.user !== null) {
        var r = req.body;
        var location = {
            latitude: r.latitude,
            longitude: r.longitude
        };
        user.setLocation(location, sess.user.username, function (result) {
            res.json(result);
        });
    } else {
        res.json(false);
    }
});

router.post('/api/get_user', function (req, res) {
    if (req.body.id === undefined) {
        res.json(false);
    } else {
        if (!req.body.id.match(/[0-9A-Fa-f]{24}/)) {
            res.json(false);
        } else {
            user.get(req.body.id, function (result) {
                res.json(result);
            });
        }
    }
});

router.post('/api/modify', function (req, res) {
    var values = req.body.update;
    console.log(values);
    sess = req.session;
    if (sess.user === undefined || sess.user === null || values === undefined) {
        res.json('Values undefined');
    } else {
        values.id = sess.user.id;
        user.modify(values, function (result) {
            res.json(result);
        });
    }
});

router.post('/api/get_tags', function (req, res) {
    user.getTags(req.body.id, function (result) {
        res.json(result);
    });
});

router.post('/api/get_recomendations', function(req, res) {
	sess = req.session;
	if (sess.user === undefined || sess.user === null) {
		res.json('you have to log in to get recomendations');
	} else {
		user.getRecomendations(sess.user.id, function(result) {
			res.json(result);
		});
	}
});

/********************************************************
 * Has to be last route. Do not put any code under this *
 ********************************************************/
router.get('*', function (req, res) {
    res.render('index');
});

module.exports = router;