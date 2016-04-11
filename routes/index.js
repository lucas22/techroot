var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Techroot'});
});

/* GET profile page. */
router.get('/profile', function (req, res, next) {
    res.render('profile', {title: 'Profile'});
});

/* GET wall page. */
router.get('/wall', function (req, res, next) {
    res.render('wall', {title: 'Wall'});
});

module.exports = router;
