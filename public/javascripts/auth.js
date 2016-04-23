/**
 * Created by lucas on 4/8/16.
 */

// Returns true if required data is ok
var ref = new Firebase("https://techroot.firebaseio.com/");
var processForm = function (mail, pw) {
    var confirmPass = $("#confirm_pass");
    ok = true;
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
var loginAPI = function (ref, target) {
    ref.authWithOAuthPopup(target, function (error, authData) {
        if (error) {
            console.warn("Login Failed!", error);
            return undefined;
        }
        console.log("Authenticated successfully with payload:", authData);

        switch(target){
            case "google":
                var provider= "google";
                var mail = authData.google.email;
                var name = authData.google.displayName;

                ref.onAuth(function(authData){
                    ref.child("users").child(authData.uid).set({
                        provider:provider,
                        email: mail,
                        name: name
                    })
                })

                break;
            case "github":
                var provider= "github";
                var username = authData.github.username;
                var name = authData.github.displayName;

                ref.onAuth(function(authData){
                    ref.child("users").child(authData.uid).set({
                        provider:provider,
                        username: username,
                        name: name
                    })
                })
                break;
        }
        window.location.href = "/wall"
        return authData;
    },
        {scope: "email"});
};

$(document).ready(function () {

    // Google authentication
    $("#btn_login_google").on("click", function () {
        if (loginAPI(ref, "google")) {
            console.warn("Google login has failed.");
        }
    });

    // Github authentication
    $("#btn_login_github").on("click", function () {
        if (loginAPI(ref, "github")) {
            console.warn("Github login has failed.");
        }
    });

    // Standard Firebase login
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

    // Firebase signup
    $("#btn_signup").click(function (e) {
        e.preventDefault();

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
            "<input class='Button' id='signup_submit_but' type='submit' value='add me!'/>" +
            "<input class='Button' id='cancel_signup_btn' type='button' value='cancel'/></div>";

        // build signin form
        $("#btn_signup").hide();
        $("#btn_login").hide();
        $("#btn_login_google").hide();
        $("#btn_login_github").hide();
        $("#login_form").append(signupFormString);

        // restore login form
        $("#cancel_signup_btn").on("click", function (e) {
            $("#signup_form").empty().remove();
            $("#btn_signup").show();
            $("#btn_login").show();
            $("#btn_login_google").show();
            $("#btn_login_github").show();
        });

        $("#signup_submit_but").on("click", function (e) {
            e.preventDefault();
            var user_mail = $("#txt_email").val();
            var passwd = $("#txt_pass").val();

            console.log("PASSING: " + passwd);
            if (!processForm(user_mail, passwd)) {
                console.log("Invalid data");
                return false;
            }

            // TODO: test this statement:
            var nick = $("#signup_nick").val() | "";
            console.log("NICK: " + nick + " EON");

            var user_identification = {
                email: user_mail,
                password: passwd
            };


            ref.createUser(user_identification, function (error, userData) {
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
                    return undefined;
                }
                console.log("Successfully created user account with uid:", userData.uid);
                var user_info = {
                    email: user_mail,
                    provider:"password",
                    name: $("#signup_name").val(),
                    nick: $("#signup_nick").val(),
                    gender: $("input[name='gender']:checked").val()
                };
                ref.child("users").child(userData.uid).set(user_info);
                window.location.href = "/profile";
                return userData;
            });

        });
    });

});

// run automated tests
var test_auth = function () {
    // testing valid emails and passwords
    var confirm = $("#confirm_pass");

    confirm.val("password");
    assert(processForm("fake@mail.com", "password"), false);
    assert(processForm("", "password"), false);
    confirm.val("abcd1234");
    assert(processForm("", "abcd1234"), false);
    assert(processForm("fake@mail.com", "abcd1234"), true);
    confirm.val("abcd-234");
    assert(processForm("", "abcd-234"), false);
    assert(processForm("fake@mail.com", "abcd-234"), false);

};