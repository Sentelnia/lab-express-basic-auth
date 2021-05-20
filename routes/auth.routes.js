// routes/auth.routes.js

const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model.js')

const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds)



////////////SIGNUP//////////////////////


// .get() route ==> to display the signup form to users
router.get('/signup', (req, res) => res.render('auth/signup'));

// .post() route ==> to process form data
router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;


    //si pas de mail ou pas de password , on rend le formulaire d'inscription
    if (!username || !password) {
      res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, salt)
    console.log(`Password hash: ${hashedPassword}`);  

    User.create({
        username: username,
        passwordHash: hashedPassword
      })
        .then(userFromDB => {
          console.log('Newly created user is: ', userFromDB);
          req.session.currentUser = userFromDB;
          res.redirect('/userProfile')
        })
        .catch(error => next(error));
  });



////////////LOGIN//////////////////////

// .get() route ==> to display the login form to users
router.get('/login', (req, res) => res.render('auth/login'));

// .post() login route ==> to process form data
router.post('/login', (req, res, next) => {
  console.log('Session', req.session)
  const { username, password } = req.body;

  if(username === '' || password === '' ){
    res.render('auth/login', {errorMessage:'Please enter both, username ans password to Login'});
    return; 
  }

  User.findOne({username})
    .then(user => {
      if (!user) {
        res.render('auth/login', {errorMessage:'Username is not valid'});
        return;
      } else if (bcrypt.compareSync(password, user.passwordHash)){
        req.session.currentUser = user;
        res.redirect('/userProfile');
      } else {
        res.render('auth/login', {errorMessage:'Password is not valid'})
      }
    })
    .catch(error => next(error));
});


////////////////LOG OUT/////////////

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

///////////////USER PROFIL////////

router.get('/userProfile', (req, res) => {
    res.render('users/user-profil', { userInSession: req.session.currentUser });
});

///////////////MAIN USER////////

router.get('/main', (req, res) => {
    res.render('users/main', { userInSession: req.session.currentUser });
})

//////////////PRIVATE USER//////

router.get('/private', (req, res) => {
  if(req.session.currentUser){
    res.render('users/private', { userInSession: req.session.currentUser });
  } else {
    res.render('auth/login', {errorMessage:'vous devez vous identifier pour acceder à ce contenu'})
  }
})

module.exports = router;
