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
        // TODO: login w/ firebase
        var email = $("#txt_email").val();
        var password =$("#txt_pass").val();
        ref.authWithPassword({
            "email": email,
            "password": password
        }, function (error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
                // If successful, send user to wall page:
                window.location.href = "/wall"
            }
        });
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
        $("#signup_submit_but").on("click", function (e) {
            e.preventDefault();
            //if the nick is not set
            var nick = "";
            nick = $("#signup_nick").val();
            if (nick === undefined)
                nick = "";

            if($("#txt_email").val() =='' || $("#signup_name").val()==''){
                alert("The email and name must be filled")
                return null;
            }
            if ($("#txt_pass").val() !== $("#confirm_pass").val()) {
                alert("Passwords do not match!");
                return null;
            }
            if(!$("#txt_pass").val().match(/^(?=.*[0-9])(?=.*[a-z])([a-zA-Z0-9]{8,})$/)){
                alert("Password must contain at least one number, only alphanumerical characters, and 8 characters");
                $("#txt_pass").val("");
                $("#confirm_pass").val("");
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

        // If successful, send user to profile page:
        // window.location.href = "/profile"
    });

});