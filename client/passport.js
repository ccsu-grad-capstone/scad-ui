const express = require('express')
const passport = require('passport')
const YahooStrategy = require('passport-yahoo').Strategy

const path = require('path')

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Yahoo profile is serialized
//   and deserialized.
passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

// Use the YahooStrategy within Passport.
//   Strategies in passport require a `validate` function, which accept
//   credentials (in this case, an OpenID identifier and profile), and invoke a
//   callback with a user object.
passport.use(new YahooStrategy({
  returnURL: 'http://localhost:3000/auth/yahoo/return',
  realm: 'http://localhost:3000/'
},
function (identifier, profile, done) {
  // asynchronous verification, for effect...
  process.nextTick(function () {
    // To keep the example simple, the user's Yahoo profile is returned to
    // represent the logged-in user.  In a typical application, you would want
    // to associate the Yahoo account with a user record in your database,
    // and return that user instead.
    profile.identifier = identifier
    return done(null, profile)
  })
}
))

var app = express.createServer()

// configure Express
app.configure(function () {
  app.set('views', path.join(__dirname, '/views'))
  app.use(express.logger())
  app.use(express.cookieParser())
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  app.use(express.session({ secret: 'keyboard cat' }))
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(app.router)
  // app.use(express.static(path.join(__dirname, '/../../public')))
})

app.get('/', function (req, res) {
  res.render('index', { user: req.user })
})

app.get('/account', ensureAuthenticated, function (req, res) {
  res.render('account', { user: req.user })
})

app.get('/login', function (req, res) {
  res.render('login', { user: req.user })
})

// GET /auth/yahoo
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Yahoo authentication will involve redirecting
//   the user to yahoo.com.  After authenticating, Yahoo will redirect the
//   user back to this application at /auth/yahoo/return
app.get('/auth/yahoo',
  passport.authenticate('yahoo', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/')
  })

// GET /auth/yahoo/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/yahoo/return',
  passport.authenticate('yahoo', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/')
  })

app.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

app.listen(3000)
console.log('Listen on port 3000')

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) { return next() }
  res.redirect('/login')
}
