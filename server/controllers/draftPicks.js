const debug = require('debug')('app:draftPicksController')

function draftPicksController(service) {

  async function getAccessTokens(req, res) {
    const { code } = req.query
    try {
      const tokens = await service.getAccessTokens(code)
      debug(`access_token: ${tokens.access_token}`)
      debug(`refresh_token: ${tokens.refresh_token}`)
      debug(`id_token: ${tokens.id_token}`)
      // res.send(tokens)
      res.redirect(`http://localhost:8081/dashboard?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}&id_token=${tokens.id_token}`)
    } catch (err) {
      debug(err.stack)
    }
  }

  async function refreshToken(req, res) {
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
  return { redirectToYahoo, getAccessTokens, refreshToken, middleware }
}

module.exports = yahooController