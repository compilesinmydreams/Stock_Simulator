const express = require('express');
const router = express.Router();

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database('./db/stock-simulator.db', err=>{
  if(err)
    return console.error(err.message);
  
  
})


/**
 * GET request for /search
 * 
 * retrieves a list of users with first name, last name, with user's query
 * renders the search.pug template with the results
 */
router.get('/', function(req, res, next){
    const search = req.query.search;

    const SEARCH_QUERY = "SELECT id, fName, lName FROM users WHERE fName = ? COLLATE NOCASE OR lName = ? COLLATE NOCASE;"
    db.all(SEARCH_QUERY, [search, search], (err, friends) => {
        if(err)
            console.log(err);
        res.render('search.pug', {friends: friends}); 
    })
});

module.exports = router;