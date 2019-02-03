$(document).ready(function () {
    $('#buttonShow').click(function () {
        $('#registerModal').modal({
            closable: false,
            onApprove: function () {
                setFormValidations();
                $('#regform').form('validate form');
                return false;
            },
            onDeny: function () {
                return false;
            }
        }).modal('show','refresh');
    });
    $('input').on('keypress',(e)=>{
        if(e.which === 13){
            setLoginFormValidation();
        }
    })
});

function setFormValidations() {
    $('#regform').form({
        inline: true,
        on: 'blur',
        revalidate: true,
        fields: {
            fname: {
                identifier: 'fname',
                rules: [
                    {
                        type: 'empty'
                    }
                ]
            },
            lname: {
                identifier: 'lname',
                rules: [
                    {
                        type: 'empty'
                    }
                ]
            },
            uname: {
                identifier: 'uname',
                rules: [
                    {
                        type: 'empty'
                    }
                ]
            },
            pword: {
                identifier: 'pword',
                rules: [
                    {
                        type: 'empty'
                    },
                    {
                        type: 'minLength[6]'
                    }
                ]
            }
        },
        onSuccess: function () {
            submitForm();

        }

    });
}
$(document).ready(
    function () {
        $('.ui.checkbox')
            .checkbox()
            ;
    });

function submitForm() {
    var values = $("#regform").serialize();
    $.ajax({
        type: "post",
        data: values,
        url: '../register',
        success: function (response) {

            if (response=='error') {
                messageFailure("Username or Name is already existing!");

            }
            else {
                messageSucess("Please wait for the Admin to approve your account");
                $('#regform').form('clear');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            messageFailure(textStatus);
        }
    });
}


function setLoginFormValidation(){
    $('#login-form').form({
        inline: true,
        on: 'submit',
        revalidate: true,
        fields: {
            uname: {
                identifier: 'uname',
                rules: [
                    {
                        type: 'empty'
                    }
                ]
            },
            pword: {
                identifier: 'pword',
                inline: true,
                on: 'blur',
                rules: [
                    {
                        type: 'empty'
                    },
                    {
                        type: 'minLength[6]'
                    }
                ]
            }
        },
        onSuccess: function () {
            loginUser();
        }

    }).form('validate form');
}


function loginUser(){
    var values = $('#login-form').serialize();
    $('#btn-login').addClass('loading');
    $.ajax({
        type: "post",
        data: values,
        url: '../login',
        success: function (response) {
            $('#btn-login').removeClass('loading');
            if (response=='not found') {
                messageFailure("Login Credentials Not Found!");

            }
            else if(response=='inactive'){
                messageFailure("Account has been deactivated!");
            }
            else if(response =='on approval'){
                messageWarning("Account On Approval, Please contact the admin");
            }
            else {
                window.location = response.redirect;
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#btn-login').removeClass('loading');
            messageFailure(textStatus);
        }
    });
};




