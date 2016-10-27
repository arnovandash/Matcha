var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', user: false, info: {likes: 1, dislikes: 2, liked: 3}, numbers: [1, 2, 3, 4, 5] });
});

/* GET users listing. */
/* another page route example
router.get('/users', function(req, res, next) {
  res.send('respond with a resource');
});

*/

module.exports = router;
