const express = require('express');
const router = express.Router();



/**
 * GET request for /register
 * 
 * renders the registration page
 */
router.get('/', function(req, res, next){
    res.render('register.pug', {userExists:true, passwordValid: true, submitted: false, new_username:'', fName: '', lName: '', amount: '', password: ''});
});

module.exports = router;