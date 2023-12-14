
/**
 * set up server
 */
const express = require("express");
const path = require('path');


const app = express();
app.set("view engine", "pug");

const session = require("express-session");
const current_session = session({secret: 'some secret'});
app.use(current_session);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

app.use(express.static('css'));
app.use(express.static('js'));

const registerRouter = require('./routes/register');
const userRouter = require('./routes/user');
const marketRouter = require('./routes/market');
const stockRouter = require('./routes/stock');
const searchRouter = require('./routes/search');

app.use('/register', registerRouter);
app.use('/user', userRouter);
app.use('/market', marketRouter);
app.use('/stock', stockRouter);
app.use('/search', searchRouter);

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database('./db/stock-simulator.db', err=>{
  if(err)
    return console.error(err.message);
  
  
})


/**
 * GET request for /
 * 
 * renders index.pug
 * userExists and passwordValid are set to true to prevent the login modal from displaying onload
 */
app.get('/', (req, res) => {        
    res.render('index.pug', {userExists: true, passwordValid: true});
})

/**
 * POST request for /
 * 
 * verifies login information
 * if username entered does not exist in the database, or the password is incorrect, re-render index.pug and display error
 * else redirect to /user where the user's information will be retrieved and redendered
 */
app.post('/', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  const USER_QUERY = "SELECT password, wallet FROM users WHERE id = ?";
  const WATCHLIST_QUERY = "SELECT symbol FROM watchlist WHERE user_id = ?"
  db.get(USER_QUERY, [username], (err, row) => {
    if(err)
      return console.error(err.message);

    if(row && password == row.password){
      db.all(WATCHLIST_QUERY, [username], (err, stocks) => {
        if(err)
          return console.error(err.message);

        req.session.username = username;
        req.session.wallet = row.wallet;
        req.session.watchlist = stocks;
        res.redirect(301, '/user');
      })
    }else{
      res.render('index.pug', {userExists: row ? true : false, passwordValid: row&&password == row.password, username: username});
    }
  });
})


app.listen(3000, () => { 
  console.log("Server started (http://localhost:3000) !");
});