/**
 * display loginModal onload based on whether the user has made a failed login attempt
 */

$(document).ready(function(){

    let display = $("#loginModal").data('display')
    if(display){
        $("#loginModal").modal('show');
    }
})