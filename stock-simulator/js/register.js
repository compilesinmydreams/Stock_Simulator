

/**
 * set confirmation password pattern to match the password entered (for form validation purposes)
 */
$('#newPassword').on('focusout', (event) => {
    let $password = $('#newPassword')[0];

    if($password.value){
        $('#confirm').attr('pattern', $password.value);
    }
})


/**
 * display errors if the register form has errors
 */
$('#register').on('submit', (event) => {

    if(!$('#register')[0].checkValidity()){
        event.preventDefault();
        event.stopPropagation();
    }
    $('#register').addClass('was-validated');
});

