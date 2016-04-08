/**
 * Created by lucas on 4/8/16.
 */

$(document).ready(function () {

    $("#btn_login").click(function (e) {
        e.preventDefault();         // comment this to release
        // TODO: login w/ firebase
        alert("Login attempt!")

        // If successful, send user to wall page:
        window.location.href = "/wall"
    });

    $("#link_signup").click(function (e) {
        e.preventDefault();
        // TODO: create signup form fields
        alert("Signup attempt!");
        // TODO: create user in firebase

        // If successful, send user to profile page:
        window.location.href = "/profile"
    });

});