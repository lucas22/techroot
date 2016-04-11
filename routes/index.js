var express = require('express');
var router = express.Router();
var multer = require('multer');

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

router.post('/', multer({dest: './uploads/'}).single('upl'), function (req, res) {
    console.log(req.body); //form fields
    console.log(req.file.filename); //form files

    // TODO: send file to Amazon S3 bucket
    //  -> use Amazon S3 API

    // TODO: create upload entry in Firebase:
    //  |__/[category]      # category [link,images,audio,video,document,...]
    //  | | |__/[item]      # unique file id
    //  | | | |__url        # file url ending (ignore if it's the same as above)
    //  | | | |__uid        # uid of creator (who is uploading)
    //  | | | |__caption    # text attached (e.g.:description, caption, hashtags)
    //  | | | |__stats      # statistics of post (e.g.: #of ++(likes) )

    res.status(204).end();
});

module.exports = router;
