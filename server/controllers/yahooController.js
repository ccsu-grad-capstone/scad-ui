const debug = require('debug')('app:yahooController')

async function oauth (service, code) {
  try {
    const tokens = await service.getAccessTokens(code)
    // this is where we'll login with mongo 
    return tokens
  } catch (err) {
  }
}

function yahooController (service) {
  var nonce = Math.floor(Math.random() * 1000000 + 1)
  debug(nonce)

  function redirectToYahoo (req, res) {
    debug(`redirectToYahoo()`)
    res.redirect(`https://api.login.yahoo.com/oauth2/request_auth?client_id=dj0yJmk9aWtZWjJXWVV3a2QyJmQ9WVdrOVZWUlBkSEZ6TldVbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTg5&redirect_uri=https://localhost:3000/auth/yahoo/redirect&response_type=code&language=en-us&scope=openid,fspt-w&nonce=${nonce}`)
  }
  async function getAccessTokens (req, res) {
    const { code } = req.query
    try {
      const tokens = await service.getAccessTokens(code)
      debug(`access_token: ${tokens.access_token}`)
      debug(`refresh_token: ${tokens.refresh_token}`)
      debug(`id_token: ${tokens.id_token}`)
      res.redirect(`http://localhost:8081/dashboard?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}&id_token=${tokens.id_token}`)
    } catch (err) {
      debug(err.stack)
    }
  }

  async function refreshToken (req, res) {
    debug('refreshToken')
    const { refresh_token } = req.query
    try {
      const tokens = await service.refreshToken(refresh_token)
      debug(`access_token: ${tokens.access_token}`)
      debug(`refresh_token: ${tokens.refresh_token}`)
      res.send(tokens) 
    } catch (err) {
      debug(err.stack)
    }
  }

  function middleware(req, res, next) {
    //if (req.user) {
      next() 
    // } else {
    //   res.redirect('/')
    // }
  }
  return { redirectToYahoo, getAccessTokens, refreshToken, middleware}
}

module.exports = yahooController