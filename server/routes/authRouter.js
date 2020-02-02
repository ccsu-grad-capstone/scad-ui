const express = require('express')
const yahooController = require ('../controllers/yahooController')
const debug = require('debug')('app:authRouter')

const authRouter = express.Router()
const yahooOauth = require('../services/yahooOauth')

function router() {
  const { getAccessTokens, middleware } = yahooController(yahooOauth)
  authRouter.use(middleware)
  authRouter.get("/yahoo", function (req, res) {
    debug(`redirect to yahoo`)
    res.redirect('https://api.login.yahoo.com/oauth2/request_auth?client_id=dj0yJmk9aWtZWjJXWVV3a2QyJmQ9WVdrOVZWUlBkSEZ6TldVbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTg5&redirect_uri=https://localhost:3000/auth/yahoo/redirect&response_type=code&language=en-us')
  });

  authRouter.get('/yahoo/redirect', getAccessTokens)

  return authRouter
}

module.exports = router()