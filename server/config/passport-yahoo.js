const passport = require('passport')
var YahooStrategy = require('passport-yahoo-oauth2').OAuth2Strategy;
const User = require('../models/user-model')

// Passport takes that user id and stores it internally on
// req.session.passport which is passport’s internal
// mechanism to keep track of things.
passport.serializeUser((user, done) => {
  done(null, user.id)
})

// makes a request to our DB to find the full profile information
// for the user and then calls done(null, user). This is where
// the user profile is attached to the request handler at req.user.
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    // This takes the profile info and attaches it on the request
    // object so its available on your callback url as req.user.
    done(null, user)
  })
})

// Implementing the passport yahoo strategy

passport.use(new YahooStrategy({
  clientID:
  'dj0yJmk9dG5YTU9UMHBpQWJ6JmQ9WVdrOWVFMWxWbk5yTlRBbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTgz',
  clientSecret: '9b4d5c8a1476471ed965139aa011ea43f7c7ddbd',
  callbackURL: "http://127.0.0.1:3000/auth/yahoo/redirect"
},
function(token, tokenSecret, profile, done) {
  User.findOrCreate({ yahooId: profile.id }, function (err, user) {
    return done(err, user);
  });
}
));

