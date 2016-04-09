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
        $("#link_signup").hide();
        $("#btn_login").hide();
        $("#login_form").append("<input id='confirm_pass' type='password' placeholder='****' required/>" +
            "<input id='signup_name' type='text' placeholder='Your name' required/>" +
            "<input id='signup_nick' type='text' placeholder='nickname'/>" +
            "<input type='radio' name='gender' value='male'/>Male" +
            "<input type='radio' name='gender' value='female'/>Female" +
            "<input type='radio' name='gender' value='other'/>Other" +
            "<input id='signup_submit_but' type='submit'/>"
        );


        //alert("Signup attempt!");
        // TODO: create user in firebase

        // If successful, send user to profile page:
        // window.location.href = "/profile"
    });

});