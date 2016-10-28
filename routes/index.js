var express = require('express');
var session = require('express-sesison');
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

module.exports = router;