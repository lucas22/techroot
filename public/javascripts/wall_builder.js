/**
 * Created by lucas on 5/1/16.
 */

// Dynamically builds the Wall content
var wall_builder = function (files) {
    files = files.split(',');

    var ref_upl_img = new Firebase("https://techroot.firebaseio.com/uploads/image/");
    for (f in files) {

        //----------------
        // TODO: get the information below from Firebase
        // files[f] is the key:    https://techroot.firebaseio.com/uploads/image/ + files[f]
        // console.log(files[f]);

        var caption = "caption undefined";      // caption in Firebase
        var pplus = "X";                        // stats/pplus in FB
        var username = "username undefined";    // just 'name' in FB

        
        //----------------

        var fields = "<div class='Tile' id='tile" + f + "'>" +
            "<p class='post_name'>" + username + "</p>" +
            "<p class='caption'>" + caption + "</p>" +
            "<img class='Wallpic' src='uploads/" + files[f] + "'>" +
            "<p class='pplus'>" + pplus + "++</p>" +
            "</div>";

        $(".Wall").append(fields);
    }
};
