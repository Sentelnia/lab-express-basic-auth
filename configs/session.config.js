const session = require('express-session');

const MongoStore = require('connect-mongo')

const mongoose = require('mongoose');

module.exports = app => {
    app.use(
      session({
        secret: process.env.SESS_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60000 } ,
        store: MongoStore.create({ 
            mongoUrl: 'mongodb://localhost/express-basic-auth-dev',
            ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
        })
      })
    );
  };

