
/**
 * toggle between day, week, month, year percentage change is stock
 */
$("input[name=diffOptions]").on('change', function(event){
    if(event.target.value === "day"){
        $("#diff_day").show();
        $("#diff_week").hide();
        $("#diff_month").hide();
        $("#diff_year").hide();
    }
    if(event.target.value === "week"){
        $("#diff_day").hide();
        $("#diff_week").show();
        $("#diff_month").hide();
        $("#diff_year").hide();
    }
    if(event.target.value === "month"){
        $("#diff_day").hide();
        $("#diff_week").hide();
        $("#diff_month").show();
        $("#diff_year").hide();
    }
    if(event.target.value === "year"){
        $("#diff_day").hide();
        $("#diff_week").hide();
        $("#diff_month").hide();
        $("#diff_year").show();
    }
})

/**
 * toggle between buy and sell shares
 */
$("input[name=transactionType]").on('change', function(event){
    if(event.target.value === 'sell'){
        $("#sell_div").show();
        $("#buy_div").hide();
        $("#purchase_btn").hide();
        $("#sell_btn").show();
    }
    if(event.target.value === 'purchase'){
        $("#sell_div").hide();
        $("#buy_div").show();
        $("#purchase_btn").show();
        $("#sell_btn").hide();       
    }
})

/**
 * toggle add/remove stock from watchlist and make corresponding updates to database
 */
$(".watchlist").on('click', function(event){
    if(event.target.id == 'add_stock'){
        $("#add_stock").hide();
        $("#remove_stock").show();
        $("#addWatchlist").attr('checked', true);
        $("#rmvWatchlist").attr('checked', false);
        $('#watchlist').trigger('submit');
    }

    if(event.target.id == 'remove_stock'){
        $("#add_stock").show();
        $("#remove_stock").hide();
        $("#addWatchlist").attr('checked', false);
        $("#rmvWatchlist").attr('checked', true);
        $('#watchlist').trigger('submit');
    }
})

/**
 * makes post request to /stock to modify watchlist
 */
$("#watchlist").on('submit', function(event){
    event.preventDefault();

    $.ajax({
        type: 'POST',
        url: '/stock',
        data: {
            isWatchlist: $('#rmvWatchlist').attr('checked') ? 1 : 0,
            symbol: $('#symbol').val(),
        },
    })


})

/**
 * updates information when add stock button is clicked on the buy shares form
 * prevents user error by disabling button if max shares are reached (wallet is lesser than price)
 * re-enables minus buy button when clicked
 */
$('#add_btn_buy').on('click', function(event){
    
    let newValue = parseInt($('#numStock_buy').val()) + 1;
    $('#numStock_buy').val(newValue);
    let cost = updateCost(newValue);
    $('#cost').val(Math.round(parseFloat(cost) * 100) / 100);

    let money = $('#money').val();

    if((parseInt(newValue)-1) == 0){
        $('#minus_btn_buy').attr('disabled', false);
    }

    let nextCost = updateCost(parseInt(newValue)+1);

    if(parseFloat(nextCost) > parseFloat(money)){
        $('#add_btn_buy').attr('disabled', true);
    }
})

/**
 * updates information when minus stock button is clicked on the buy shares form
 * prevents user error by disabling button if 0 shares is reached (cannot purchase negative shares)
 * re-enables add buy button when clicked
 */
$('#minus_btn_buy').on('click', function(event){
    let newValue = parseInt($('#numStock_buy').val()) -1;
    $('#numStock_buy').val(newValue);
    let cost = updateCost(newValue);
    $('#cost').val(Math.round(parseFloat(cost) * 100) / 100);

    if(newValue == 0){
        $('#minus_btn_buy').attr('disabled', true);
    }

    $('#add_btn_buy').attr('disabled', false);
})

/**
 * buy stock allows user to enter number shares they wish to purchase as opposed to using the buttons
 * if user enters an invalid amount, change number to closest valid amount
 *      negative shares changed to 0
 *      positive shares changed to max number of shares that can be purhcased given the user's wallet
 */
$('#numStock_buy').on('focusout', function(){
    let currentVal = parseInt($('#numStock_buy').val());
    let cost = updateCost(currentVal);
    
    let money = $('#money').val();
    let price = $('#price').val();

    if(parseFloat(money) < parseFloat(price)){
        return;
    }
 

    if(!currentVal || parseInt(currentVal) < 0){
        $('#numStock_buy').val(0);
        $('#cost').val(0);
        $('#minus_btn_buy').attr('disabled', true);
        $('#add_btn_buy').attr('disabled', false);
        return;

    }

    let maxStocks = parseInt(parseFloat(money)/parseFloat(price));


    if(cost > money){
        $('#add_btn_buy').attr('disabled', true);
        $('#minus_btn_buy').attr('disabled', false);
        $('#cost').val(Math.round(parseFloat(updateCost(maxStocks)) * 100) / 100);
        $('#numStock_buy').val(maxStocks);
    }else{
        if(currentVal == 0){
            $('#minus_btn_buy').attr('disabled', true);
        }else{
            $('#minus_btn_buy').attr('disabled', false);
        }

        if(currentVal == maxStocks)
            $('#add_btn_buy').attr('disabled', true);
        $('#cost').val(Math.round(parseFloat(updateCost(currentVal)) * 100) / 100);
    }
})

//update display for how much the share purchase will cost
function updateCost(currentVal){
    let price = $('#price').val();
    let cost = parseFloat(price) * parseInt(currentVal);
    return cost;
}

/**
 * updates information when add stock button is clicked on the sell shares form
 * prevents user error by disabling button if max shares are reached (num shares is greater than shares owned)
 * re-enables minus sell button when clicked
 */
$('#add_btn_sell').on('click', function(event){
    let newValue = parseInt($('#numStock_sell').val()) + 1;
    $('#numStock_sell').val(newValue);
    let earned = updateCost(newValue);
    $('#earned').val(Math.round(parseFloat(earned) * 100) / 100);

    let shares = $('#shares').val();

    if((parseInt(newValue)-1) == 0)
    $('#minus_btn_sell').attr('disabled', false);

    if(newValue == shares){
        $('#add_btn_sell').attr('disabled', true);
    }
})

/**
 * updates information when minus stock button is clicked on the sell shares form
 * prevents user error by disabling button if 0 shares is reached (cannot sell negative shares)
 * re-enables add sell button when clicked
 */
$('#minus_btn_sell').on('click', function(event){
    let newValue = parseInt($('#numStock_sell').val()) -1;
    $('#numStock_sell').val(newValue);
    let earned = updateCost(newValue);
    $('#earned').val(Math.round(parseFloat(earned) * 100) / 100);

    if(newValue == 0){
        $('#minus_btn_sell').attr('disabled', true);
    }

    $('#add_btn_sell').attr('disabled', false);
})

/**
 * sell stock allows user to enter number shares they wish to sell as opposed to using the buttons
 * if user enters an invalid amount, change number to closest valid amount
 *      negative shares changed to 0
 *      positive shares changed to max number of shares that can be sold
 */
$('#numStock_sell').on('focusout', function(){
    let currentVal = parseInt($('#numStock_sell').val());
    let shares = $('#shares').val();


    if(shares == 0){
        return;
    }

    if(!currentVal || parseInt(currentVal) < 0){
        $('#earned').val(0);
        $('#numStock_sell').val(0);
        $('#minus_btn_sell').attr('disabled', true);
        $('#add_btn_sell').attr('disabled', false);
        return;
    }


    if(currentVal > shares){
        $('#add_btn_sell').attr('disabled', true);
        $('#minus_btn_sell').attr('disabled', false);
        $('#earned').val(Math.round(parseFloat(updateCost(shares)) * 100) / 100);
        $('#numStock_sell').val(shares);
    }else{
        if(currentVal == 0){
            $('#minus_btn_sell').attr('disabled', true);
        }else{
            $('#minus_btn_sell').attr('disabled', false);
        }
        if(currentVal == shares)
            $('#add_btn_sell').attr('disabled', true);
        else
            $('#add_btn_sell').attr('disabled', false);
        $('#earned').val(Math.round(parseFloat(updateCost(currentVal)) * 100) / 100);
    }
})
