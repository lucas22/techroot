/**
 * Created by lucas on 5/1/2016.
 */

var ref = new Firebase("https://techroot.firebaseio.com/");
//problemas: qd provider é password, como recuperar o nome para uma variavel

var getUsername = function (provider) {
    var name;
    switch (provider) {
        case "password":
            name = ref.getAuth().password.email;
            break;
        case "google":
            name = ref.getAuth().google.displayName;
            break;
        case "github":
            name = ref.getAuth().github.username;
            break;
    }
    return name;
};

//console.log(getName(provider))
$(document).ready(function () {

    // Set auth value to send to Node JS server
    var uname = getUsername(ref.getAuth().provider);
    var uid = ref.getAuth().uid;

    $('#uname').val(uname);
    $('#uid').val(uid);

    console.log("Name / UID: " + uname + " / " + uid);
    
    $("#logout").click(function(){
        ref.unauth();
        //console.log(ref.getAuth().uid)
        window.location="/"
    })
});