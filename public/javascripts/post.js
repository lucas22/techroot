/**
 * Created by karol on 4/22/2016.
 */
var ref= new Firebase("https://techroot.firebaseio.com/uploads/image/");
function post() {
    var file_name = document.getElementById("post_file").value;
    var message = {
        url: "hue",
        uid: "huehue",
        caption: document.getElementById("post_msg").value,
        stats: {
            likes: 0,
            timestamp: new Date().getTime()
        }
    }

    ref.push(message);
    ref.on("value",function (snapshot) {

        for( var elem in snapshot.val()){
            console.log("desespero"+elem)
            var $node = $("<div class= 'Tile' >" +
                "<div class= 'thumbnail'>" +
                "<img class= 'profile_pic' src = '/images/silvio.png'>" +
                "</div> " +
                "<p class = 'post_name'>" + "</p>" +
                "<p>" + snapshot.val()[elem].caption + "</p>" +
                "<img src = '/images/aviao.jpg'>" +
                " </div>");
            //console.log(snapshot.val()[elem].uid);
            var ref2 = new Firebase("https://techroot.firebaseio.com/users/"+snapshot.val()[elem].uid);
            console.log("blablalba"+snapshot.val()[elem].uid)
            ref2.on("value",function (snapshot2){
                $node.children(".post_name").text(snapshot2.val().email);
                console.log(snapshot2.val().name);

            })
            $("#profile_wall").append($node);
        }

    })
}



//$(document).ready(function(){
    $("#submit_post").on("click", post());


    //})