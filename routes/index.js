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
    var walk = require('walk');
    var files = [];
    var walker = walk.walk('./public/uploads', {followLinks: false});

    // gets all filenames in path
    walker.on('file', function (root, stat, next) {
        // Add this file to the list of files
        files.push(stat.name);
        next();
    });

    walker.on('end', function () {
        //console.log("FILES: " + files);
        res.render('wall', {files: files});
    });

});

/* POST uploads */
router.post('/wall/', multer({dest: './public/uploads/'}).single('upl'), function (req, res) {
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

/* GET uploads */
router.get('/uploads/', function (req, res, next) {
    var fs = require('fs');
    console.log("REQ: " + req.toString());
    console.log("RES: " + res.toString());
    fs.realpath(__dirname, function (err, path) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Path is : ' + path);
    });
    fs.readdir(__dirname, function (err, files) {
        if (err) return;
        files.forEach(function (f) {
            console.log('Files: ' + f);
        });
    });
});

module.exports = router;
