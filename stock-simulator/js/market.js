/**
 * alter window href to retrieve information of the stock clicked on
 */
$('.symbol').on('click', function(event){
    window.location.href = window.location.href.replace('/market', '/stock') + '?symbol='+event.target.id;
})