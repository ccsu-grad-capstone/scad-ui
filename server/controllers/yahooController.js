const debug = require('debug')('app:yahooController')

async function oauth (service, code) {
  try {
    const tokens = await service.getAccessTokens(code)
    // this is where we'll login with mongo 
    return tokens
  } catch (err) {
    debug(err.stack)
  }
}

function yahooController (service) {
  async function getAccessTokens (req, res) {
    const { code } = req.query
    const tokens = await oauth(service, code)
    debug(`access_token: ${tokens.access_token}`)
    debug(`refresh_token: ${tokens.refresh_token}`)
    res.redirect(`http://localhost:8081/dashboard?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`)
  }

  function middleware(req, res, next) {
    //if (req.user) {
      next() 
    // } else {
    //   res.redirect('/')
    // }
  }
  return { getAccessTokens, middleware}
}

module.exports = yahooController