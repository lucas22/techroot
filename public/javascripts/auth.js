/**
 * Created by lucas on 4/8/16.
 */

$(document).ready(function () {
    var ref = new Firebase("https://techroot.firebaseio.com/");

    $("#btn_login_google").on("click", function(e){
        ref.authWithOAuthPopup("google", function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
                window.location.href = "/wall"
            }
        });
    });

    $("#btn_login").click(function (e) {
        e.preventDefault();         // comment this to release

        var email = $("#txt_email").val();
        var password =$("#txt_pass").val();
        ref.authWithPassword({
            "email": email,
            "password": password
        }, function (error, authData) {
            if (error) {
                console.log("Login Failed!", error);
                alert("Login Failed: " + error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
                // If successful, send user to wall page:
                window.location.href = "/wall"
            }
        });
    });

    $("#btn_signup").click(function (e) {
        e.preventDefault();

        $("#btn_signup").hide();
        $("#btn_login").hide();
        $("#btn_login_google").hide();
        $("#login_form").append("<input class='Txt_input' id='confirm_pass' type='password' placeholder='retype pass' required/>" +
            "<input class='Txt_input' id='signup_name' type='text' placeholder='real name (or not)' required/>" +
            "<input style='margin-bottom: 1em;' class='Txt_input' id='signup_nick' type='text' placeholder='geek name'/>" +
            "<div id='radio_btns'>" +
            "<input class='Radio' type='radio' name='gender' value='male'/>" +
            "<label for='male'>Male</label>" +
            "<input class='Radio' type='radio' name='gender' value='female'/>" +
            "<label for='female'>Female</label>" +
            "<input class='Radio' checked='' type='radio' name='gender' value='none'/>" +
            "<label for='none'>Undecided</label>" +
            "</div>" +
            "<input class='Btn_login' id='signup_submit_but' type='submit' value='add me!'/>"
        );

        $("#signup_submit_but").on("click", function (e) {
            e.preventDefault();

            clearPasswords = function () {
                $("#txt_pass").val("");
                $("#confirm_pass").val("");
            };
            var nick = "";
            nick = $("#signup_nick").val();
            if (nick === undefined)
                nick = "";

            if($("#txt_email").val() =='' || $("#signup_name").val()==''){
                alert("The email and name must be filled");
                clearPasswords();
                return null;
            }
            if ($("#txt_pass").val() !== $("#confirm_pass").val()) {
                alert("Passwords do not match!");
                clearPasswords();
                return null;
            }
            if(!$("#txt_pass").val().match(/^(?=.*[0-9])(?=.*[a-z])([a-zA-Z0-9]{8,})$/)){
                alert("Password must contain at least one number, only alphanumerical characters, and 8 characters");
                clearPasswords();
                return null;
            }
            var message_signup = {};

            message_signup = {
                email: $("#txt_email").val(),
                password: $("#txt_pass").val()
            };

            ref.createUser(message_signup, function (error, userData) {
                if (error) {
                    switch (error.code) {
                        case "EMAIL_TAKEN":
                            console.log("The new user account cannot be created because the email is already in use.");
                            break;
                        case "INVALID_EMAIL":
                            console.log("The specified email is not a valid email.");
                            break;
                        default:
                            console.log("Error creating user:", error);
                    }
                } else {
                    console.log("Successfully created user account with uid:", userData.uid);
                    var message_signup2 = {
                        email: $("#txt_email").val(),
                        name: $("#signup_name").val(),
                        nick: nick,
                        gender: $("input[name='gender']:checked").val()
                    };
                    ref.child("Users/" + userData.uid).set(message_signup2);
                    console.log("Successfully created user account with uid:", userData.uid);
                    window.location.href = "/profile"
                }
            });

        });
    });

});