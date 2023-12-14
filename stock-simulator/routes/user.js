const express = require('express');
const router = express.Router();

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database('./db/stock-simulator.db', err=>{
  if(err)
    return console.error(err.message);
  
  
})


/**
 * GET request for /user, /user?id=
 * 
 * may take in query parameter for username
 * if the query parameter for a username exists,the activity page displayed is not the current user
 * else display current user's activity page
 * 
 * retrieve list of friends, information about stocks held in portfolio
 *    if the query parameter exists, whether the current user is following the user queried
 *        information is used to toggle the follow, unfollow button
 * 
 * renders user.pug (activity page)
 * 
 */
router.get('/', function(req, res, next){

  const FRIEND_QUERY = "SELECT id, fName, lName FROM users INNER JOIN following ON following.following_id = users.id WHERE follower_id = ?";
  const PORTFOLIO_QUERY = "SELECT portfolio.symbol, company, price, day FROM portfolio INNER JOIN stocks on stocks.symbol = portfolio.symbol INNER JOIN diffs on diffs.symbol = portfolio.symbol WHERE user_id = ?";
  const FOLLOWING_QUERY = "SELECT * FROM following WHERE follower_id = ? AND following_id = ?;";

  let username = req.session.username;
  let id = req.query.id;
  let current_user = id ? id : username;
  let otherProfile = !(current_user == username)

  db.serialize(() => {
    
    db.all(FRIEND_QUERY, [current_user], (err, friends) => {
      if(err)
        return console.error(err.message);
  
      db.all(PORTFOLIO_QUERY, [current_user], (err, portfolio) => {
        if(err)
          return console.error(err.message);
  
        if(otherProfile){
          db.get(FOLLOWING_QUERY, [username, current_user], (err, following) => {
            res.render('user.pug', {stocks: portfolio, friends: friends, name: current_user, note:'Day 5 of trying to be an investment banker :\')', otherProfile: otherProfile, following: following ? true: false});   
          })

        }else{
          res.render('user.pug', {stocks: portfolio, friends: friends, name: current_user, note:'Day 5 of trying to be an investment banker :\')', otherProfile: otherProfile});   
        }
  
      })
      
    });
    
  })
  
});


/**
 * POST request for /user/register
 * 
 * takes in parameter
 *    username: string, username they wish to have
 *    fName: string, user's first name
 *    lName: string, user's last name
 *    password: string, user's password
 *    wallet: integer, starting amount user wishes to start with
 * 
 * if username already exists in database, re-render register.pug template with all fields inputted to indicate the username has been taken
 * else, insert user into database and redirect them to their activity's page
 * 
 */
router.post('/register', (req, res) => {
  let username = req.body.new_username;
  let fName = req.body.fName;
  let lName = req.body.lName;
  let password = req.body.password;
  let wallet = req.body.amount;

  const USER_QUERY = "SELECT * FROM users WHERE id=?;";
  const USER_INSERT = "INSERT INTO users(id, password, fName, lName, wallet) VALUES(?, ?, ?, ?, ?);"

  db.get(USER_QUERY, [username], (err, user) => {
    if(user){
      res.render('register.pug', {submitted: true, new_username: username, fName: fName, lName: lName, amount: wallet, password: password});
    }else{
      db.run(USER_INSERT, [username, password, fName, lName, wallet], (err) => {
        if(err)
          return console.error(err.message);
        req.session.username = username;
        req.session.wallet = wallet;
        req.session.watchlist = [];
        res.redirect(301, '/user');
      })
    }
  })
})

/**
 * POST request for /user
 * 
 * takes in parameter
 *    isFollowing: boolean determines whether to add follow, or remove follow towards specified friend
 *    name: name of user you wish to follow/unfollow
 * makes insert or delete to the following table in the database
 * 
 */
router.post('/', (req, res) => {

  let username = req.session.username;
  let isFollowing = req.body.isFollowing;
  let name = req.body.name;

  let FOLLOWING_INSERT = "INSERT INTO following(follower_id, following_id) VALUES(?, ?);";
  let FOLLOWING_DELETE = "DELETE FROM following WHERE follower_id=? AND following_id=?;"

  if(isFollowing == 0){
    db.run(FOLLOWING_INSERT, [username, name]);
  }else{
      db.run(FOLLOWING_DELETE, [username, name]);
  }
  res.send('');


})

module.exports = router;