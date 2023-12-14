const express = require('express');
const router = express.Router();

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database('./db/stock-simulator.db', err=>{
  if(err)
    return console.error(err.message);
  
  
})

/**
 * GET request for /stock?symbol=
 * 
 * takes in the symbol from the query to display a certain stock page
 * retrieves any share purchases that have been made by the user in regards to the stock
 * retrieves information about the stock
 * retrieves whether the stock is found on the user's watchlist - important to toggle the Add to Watchlist and Remove from Watchlist button
 * renders the stock.pug template with information listed above
 * 
 * note: if the stock does not have information in the database yet, the construction.pug page will be displayed
 */

router.get('/', function(req, res, next){
    const STOCK_QUERY = "SELECT stocks.symbol, company, price, day, week, month, year FROM stocks INNER JOIN diffs on diffs.symbol = stocks.symbol WHERE stocks.symbol = ?;";
    const TRANSACTIONS_QUERY = "SELECT shares FROM purchases WHERE user_id = ? AND symbol = ? AND sold = 0";
    const WATCHLIST_QUERY = "SELECT symbol FROM watchlist WHERE user_id=? AND symbol=?;";

    let symbol = req.query.symbol;
    let wallet = req.session.wallet;
    let username = req.session.username;
    let watchlist = req.session.watchlist;

    db.get(WATCHLIST_QUERY, [username, symbol], (err, watchlist) => {
        db.get(STOCK_QUERY, [symbol], (err, info) => {
            if(err)
              return console.error(err.message);

            if(!info){
                res.render('construction.pug');
                return;
            }
      
            db.all(TRANSACTIONS_QUERY, [username, symbol], (err, transactions) => {
                if(err)
                    return console.error(err.message);
    
                let shares = transactions.reduce(function(total, transaction) {return parseInt(total)+parseInt(transaction.shares)}, 0);
                res.render('stock.pug', {info: info, wallet: wallet, shares: shares, watchlist: (watchlist?true:false)});
                
            })
           
        })

    })
});


/**
 * POST request for /stock
 * 
 * takes in the following parameters:
 *      symbol: symbol of stock to make changes to
 *      transaction:
 *          transactionType: 'purchase', 'sell', or ''
 *          price: the price of a single share of the stock
 *          wallet: the amount of money the user has
 *          numStock_buy: the number of shares purhcased
 *          numStock_sell: the number of shares bought
 *      isWatchlist: boolean indicating whether to add or remove stock from watchlist
 * 
 * potential actions depending what information is received - buy/sell shares, add/remove from watchlist
 * purchase stock: add stock to user's portfolio, add purchase to list of user's purchases, deduct cost from user's wallet
 * sell stock: potentially remove stock from user's portfolio, subtract stocks from user's purchases, add profit to user's wallet
 * add to watchlist: add stock to user's watchlist
 * remove from watchlist: remove stock from user's watchlist
 */
router.post('/', (req, res) => {

    let username = req.session.username;
    let transaction = req.body.transactionType;
    let isWatchlist = req.body.isWatchlist;
    let symbol = req.body.symbol

    let WATCHLIST_INSERT = "INSERT INTO watchlist(user_id, symbol) VALUES(?, ?);";
    let WATCHLIST_DELETE = "DELETE FROM watchlist WHERE user_id=? AND symbol=?;"

    if(transaction){
        let price = req.body.price;
        let wallet = req.body.money;
        if(transaction == "purchase"){
            let shares = req.body.numStock_buy;
            buyShares(username, symbol, price, wallet, shares, res, req);
        }else{
            let owned = req.body.shares;
            let shares = req.body.numStock_sell;

            sellShares(username, symbol, owned, shares, price, wallet, res, req);
        }

    }else if(isWatchlist){
        if(isWatchlist == 0){
            db.run(WATCHLIST_INSERT, [username, symbol]);
        }else{
            db.run(WATCHLIST_DELETE, [username, symbol]);
        }
        res.send('');
    }

})


/**
 * Helper function to sell shares
 * 
 * removes shares from list of unsold transactional purhcases made from the user (note: user may purchase shares multiple times at multiple price points)
 * updates affected shares accordingly
 * if there are no more remaining shares owned by the user, remove stock from portfolio
 * makes call to update amount in wallet
 */
function sellShares(username, symbol, owned, shares, price, wallet, res, req){

    let PURCHASES_QUERY = "SELECT * FROM purchases WHERE user_id = ? AND symbol = ? AND sold = 0;";
    let PURCHASES_UPDATE = "UPDATE purchases SET shares = ?, sold = ? WHERE purchase_id = ?;";
    let PORTFOLIO_DELETE = "DELETE FROM portfolio WHERE user_id = ? AND symbol = ?;";

    db.all(PURCHASES_QUERY, [username, symbol], (err, purchases) => {
        let values = [];
        let remainingStocks = parseInt(shares);

        purchases.forEach(purchase => {
            if(remainingStocks == 0){
                return;
            }

            if(remainingStocks >= purchase.shares){
                remainingStocks = parseInt(remainingStocks) - parseInt(purchase.shares);
                purchase.shares = 0;
            }else{
                purchase.shares = parseInt(purchase.shares) - parseInt(remainingStocks);
                remainingStocks = 0;
            }

            values.push([purchase.shares, purchase.shares == 0 ? 1 : 0, purchase.purchase_id]);
        })
        db.serialize(() => {
            values.forEach(value => {
                db.run(PURCHASES_UPDATE, value);
            });
            if(owned == shares){
                db.run(PORTFOLIO_DELETE, [username, symbol], () => {
                    updateWallet((parseFloat(price) * parseFloat(shares)), wallet, username, '/stock?symbol='+symbol, res, req);
                })
            }else{
                updateWallet((parseFloat(price) * parseFloat(shares)), wallet, username, '/stock?symbol='+symbol, res, req);
            }
        })
        
    })
}


/**
 * Helper function to buy shares
 * 
 * adds purchase to list of user's purchases
 * adds stock to portfolio if it is not already there
 * makes call to update wallet
 */
function buyShares(username, symbol, price, wallet, shares, res, req){
    const PURCHASES_QUERY = "INSERT INTO purchases (user_id, symbol, price, shares, sold) VALUES (?, ?, ?, ?, ?);";
    const PORTFOLIO_QUERY = "INSERT OR IGNORE INTO portfolio (user_id, symbol) VALUES (?, ? );";

    db.run(PORTFOLIO_QUERY, [username, symbol], () => {
        db.run(PURCHASES_QUERY, [username, symbol, price, shares, 0], () => {
            updateWallet(-(parseFloat(price)*parseFloat(shares)), wallet, username,'/stock?symbol='+symbol, res, req);
        })
    })
}

/**
 * Helper function to update wallet
 * 
 * updates wallet by amount specified by transaction (buy is a negative amount, sell is a positive amount)
 * updates wallet in session (prevents needing to make multiple queries to database in other requests)
 * redirects user to same stock page to show that the transaction was successful
 */
function updateWallet(amount, wallet, username, url, res, req){

    const UPDATE_QUERY = "UPDATE users SET wallet = ? WHERE id = ?;";
    db.run(UPDATE_QUERY, [(parseFloat(wallet)+parseFloat(amount)), username], () => {
        req.session.wallet = parseFloat(wallet)+parseFloat(amount);
        res.redirect(301, url);
    });

}

module.exports = router;