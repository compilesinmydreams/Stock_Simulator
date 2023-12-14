
/**
 * alter window href to redirect user to /market by clicking Go to Market button
 */
$('#market').on('click', function(event){
    window.location.href = window.location.href.replace('/user', '/market');
})

/**
 * toggle follow/unfollow user and make corresponding updates to database
 */
$(".following").on('click', function(event){
    if(event.target.id == 'add_Follow'){
        $("#add_Follow").hide();
        $("#remove_Follow").show();
        $("#addFollow").attr('checked', true);
        $("#rmvFollow").attr('checked', false);
        $('#following').trigger('submit');
    }

    if(event.target.id == 'remove_Follow'){
        $("#add_Follow").show();
        $("#remove_Follow").hide();
        $("#addFollow").attr('checked', false);
        $("#rmvFollow").attr('checked', true);
        $('#following').trigger('submit');
    }
})

/**
 * makes post request to /user to modify user's following
 */
$("#following").on('submit', function(event){
    event.preventDefault();

    $.ajax({
        type: 'POST',
        url: '/user',
        data: {
            isFollowing: $('#rmvFollow').attr('checked') ? 1 : 0,
            name: $('#name').val(),
        },
    })


})