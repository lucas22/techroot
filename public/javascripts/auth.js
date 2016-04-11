/**
 * Created by lucas on 4/8/16.
 */

var ref = new Firebase("https://techroot.firebaseio.com/");

// Returns true if required data are ok
var processForm = function (mail, pw) {
    var confirmPass = $("#confirm_pass");
    ok = true;
    console.log(pw);
    console.log(confirmPass.val());
    if (pw !== confirmPass.val()) {
        alert("Passwords do not match!");
        ok = false;
    }
    else if (!pw.match(/^(?=.*[0-9])(?=.*[a-z])([a-zA-Z0-9]{8,})$/)) {
        alert("Passwords with at least one number, [a-z][A-Z][0-9] only, and 8 characters");
        ok = false;
    }
    else if (mail == '' || $("#signup_name") == '') {
        alert("The email and name must be filled");
        ok = false;
    }
    if (!ok) {
        $("#txt_pass").val("");
        confirmPass.val("");
        return false;
    }
    return true;
};

// Does the login given a target API as parameter (google or github)
var loginAPI = function (target) {
    ref.authWithOAuthPopup(target, function (error, authData) {
        if (error) {
            console.warn("Login Failed!", error);
        } else {
            console.log("Authenticated successfully with payload:", authData);
            window.location.href = "/wall"
        }
    });
};

$(document).ready(function () {

    // Google authentication
    $("#btn_login_google").on("click", function () {
        loginAPI("google");
    });

    // Github authentication
    $("#btn_login_github").on("click", function () {
        loginAPI("github");
    });

    // Standard Firebase authentication
    $("#btn_login").click(function (e) {
        e.preventDefault();
        var user_mail = $("#txt_email").val();
        var passwd = $("#txt_pass").val();
        ref.authWithPassword({
            "email": user_mail,
            "password": passwd
        }, function (error, authData) {
            if (error) {
                console.warn("Login Failed!", error);
                alert("Login Failed: " + error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
                // If successful, send user to wall page:
                window.location.href = "/wall"
            }
        });
    });

    $("#btn_signup").click(function (e) {
        var user_mail = $("#txt_email").val();
        var passwd = $("#txt_pass").val();
        e.preventDefault();
        $("#btn_signup").hide();
        $("#btn_login").hide();
        $("#btn_login_google").hide();
        $("#btn_login_github").hide();

        var signupFormString = "<div id='signup_form'><input class='Txt_input' id='confirm_pass' type='password' placeholder='retype pass' required/>" +
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
            "<input class='Button' id='signup_submit_btn' type='submit' value='add me!'/>" +
            "<input class='Button' id='cancel_signup_btn' type='button' value='cancel'/></div>";

        $("#login_form").append(signupFormString);

        $("#cancel_signup_btn").on("click", function (e) {
            $("#signup_form").empty().remove();
            $("#btn_signup").show();
            $("#btn_login").show();
            $("#btn_login_google").show();
            $("#btn_login_github").show();
        });

        $("#signup_submit_but").on("click", function (e) {
            e.preventDefault();

            // check required fields. Returns true if ok
            console.log("PASSING: " + passwd);
            if (!processForm(user_mail, passwd)) {
                console.log("Invalid data");
                return false;
            }

            var nick = "";
            nick = $("#signup_nick").val();
            if (nick === undefined)
                nick = "";

            var message_signup = {
                email: user_mail,
                password: passwd
            };

            console.warn("Warning FAKE");
            ref.createUser(message_signup, function (error, userData) {
                if (error) {
                    switch (error.code) {
                        case "EMAIL_TAKEN":
                            console.warn("The email is already in use.");
                            break;
                        case "INVALID_EMAIL":
                            console.warn("Not a valid email.");
                            break;
                        default:
                            console.warn("Error creating user:", error);
                    }
                } else {
                    console.log("Successfully created user account with uid:", userData.uid);
                    var message_signup2 = {
                        email: user_mail,
                        name: $("#signup_name").val(),
                        nick: nick,
                        gender: $("input[name='gender']:checked").val()
                    };
                    ref.child("Users/" + userData.uid).set(message_signup2);
                    window.location.href = "/profile"
                }
            });

        });
    });

});