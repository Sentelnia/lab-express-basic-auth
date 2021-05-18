// routes/auth.routes.js

const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model.js')

const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds)

// .get() route ==> to display the signup form to users
router.get('/signup', (req, res) => res.render('auth/signup'));

// .post() route ==> to process form data
router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
 
    const hashedPassword = bcrypt.hashSync(password, salt)
    console.log(`Password hash: ${hashedPassword}`);  

    User.create({
        username: username,
        passwordHash: hashedPassword
      })
        .then(userFromDB => {
          console.log('Newly created user is: ', userFromDB);
        })
        .catch(error => next(error));
  });

module.exports = router;
