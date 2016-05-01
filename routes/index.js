var express = require('express');
var router = express.Router();
var multer = require('multer');
var Firebase = require('firebase');

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

    //console.log(req.body); //form fields
    var randomKey = req.file.filename;
    var uname = req.body.uname;
    var uid = req.body.uid;
    var caption = req.body.caption;

    // TODO: send file to Amazon S3 bucket
    //  -> use Amazon S3 API

    // Creates upload entry in Firebase:
    function firebaseUpload() {

        // Auth
        var ref = new Firebase("https://techroot.firebaseio.com/");
        var ref_upl_img = new Firebase("https://techroot.firebaseio.com/uploads/image/");

        console.log("ref: " + ref);

        // Entry
        var message = {
            uid: uid,
            name: uname,
            caption: caption,
            stats: {
                pplus: 0,
                timestamp: new Date().getTime()
            }
        };
        ref_upl_img.child(randomKey).set(message, function (error) {
            if (error) {
                console.log("Error saving post information to Firebase." + error);
            }
        });
    }

    firebaseUpload();

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
