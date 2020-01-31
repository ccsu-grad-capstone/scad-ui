var express = require('express');
var chalk = require('chalk')
var debug = require('debug')('app')
var router = express.Router();
var passport = require('passport');
var axios = require('axios')

// router.get("/yahoo", passport.authenticate("yahoo"));

router.get("/yahoo", function (req, res) {
  debug(`redirect to yahoo`)
  res.redirect('https://api.login.yahoo.com/oauth2/request_auth?client_id=dj0yJmk9a2xIZVk3Y0pjVnhEJmQ9WVdrOVFUaG9NRnA1TTJNbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTVi&redirect_uri=https://localhost:3000/auth/yahoo/redirect&response_type=code&language=en-us')
});

router.get("/yahoo/redirect", (req, res) => {
    // For redirecting into the client app
    debug('yahoo/redirect - code: ', req.query.code)
    var data = {
      client_id: 'dj0yJmk9a2xIZVk3Y0pjVnhEJmQ9WVdrOVFUaG9NRnA1TTJNbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTVi',
      client_secret: 'b5f151168beea78374fcd9ddaf555cb57023e32e',
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:8081/',
      code: req.query.code
    }
    let headers = {
      headers: {
          'Authorization': 'Basic ZGoweUptazlhMnhJWlZrM1kwcGpWbmhFSm1ROVdWZHJPVkZVYUc5TlJuQTFUVEpOYldOSGJ6bE5RUzB0Sm5NOVkyOXVjM1Z0WlhKelpXTnlaWFFtYzNZOU1DWjRQVFZpOiBiNWYxNTExNjhiZWVhNzgzNzRmY2Q5ZGRhZjU1NWNiNTcwMjNlMzJlCg==',
          'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    // axios.post(`https://api.login.yahoo.com/oauth2/get_token?client_id=dj0yJmk9a2xIZVk3Y0pjVnhEJmQ9WVdrOVFUaG9NRnA1TTJNbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTVi&client_secret=b5f151168beea78374fcd9ddaf555cb57023e32e&grant_type=authorization_code&redirect_uri=http://localhost:8081/yahoo/redirect&code=${req.query.code}`)

    axios.post('https://api.login.yahoo.com/oauth2/get_token', data)
      .then((response) => {
        debug(response)
      })
      .catch((err) => {
        debug(err)
      });
      // res.redirect("http://localhost:8081/");
  }
);


// The API to log out, it clears req.user
router.get('/logout', function(req, res, next) {
  req.logout();
  res.json({ msg: "Logged out" });
});

module.exports = router;