const express = require('express');
const router = express.Router();
// passport including
const passport = require('passport');

const users = require('../controller/users')


router.route('/register')
    .get(users.registerEJS)
    .post(users.registerDataInsert); // this is when we register on this website and data get stored in tha database 


router.route('/login')
    .get(users.userLoginEJS) // bu login url we go at login page
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' ,session: true}), users.CheckLoginEJS) // this is when we login in we always have to use this

router.route('/car/allcars/:id/rentedcars')
      .get(users.mycars);

// this is for when we log out simply use the .logout() function
router.get('/logout', users.Logout)



module.exports = router;