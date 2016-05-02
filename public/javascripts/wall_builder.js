/**
 * Created by lucas on 5/1/16.
 */



// Dynamically builds the Wall content
var wall_builder = function (files) {
    files = files.split(',');

    var ref_upl_img = new Firebase("https://techroot.firebaseio.com/uploads/image/");


    //----------------
    // TODO: get the information below from Firebase
    // files[f] is the key:    https://techroot.firebaseio.com/uploads/image/ + files[f]
    // console.log(files[f]);

    ref_upl_img.on('value', function (snapshop) {

        for (f in files) {
            var values = snapshop.val();
            console.log(values)
            console.log(values[files[f]])
            if (values[files[f]]) {

                var caption = values[files[f]].caption;      // caption in Firebase
                var pplus = values[files[f]].stats.pplus;                        // stats/pplus in FB
                var username = values[files[f]].name;    // just 'name' in FB

                var fields = "<div class='Tile' id='tile" + f + "'>" +
                    "<p class='post_name'>" + username + "</p>" +
                    "<p class='caption'>" + caption + "</p>" +
                    "<img class='Wallpic' src='uploads/" + files[f] + "'>" +
                    "<p class='pplus'>" + pplus + "++</p>" +
                    "</div>";

                $(".Wall").append(fields);

            }
        }
    })

    //----------------


}
