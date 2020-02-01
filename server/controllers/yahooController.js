const debug = require('debug')('app:yahooController')

async function oauth (service, code) {
  try {
    const tokens = await service.getTokens(code)
    // this is where we'll login with mongo 
    res.redirect(`http://localhost:8081/dashboard/${tokens}`)
  } catch (err) {
    debug(err.stack)
  }
}

function yahooController (service) {
  function getTokens (req, res) {
    const { code } = req.query
    debug(`code: ${code}`)
    oauth(service, code)
  }

  function middleware(req, res, next) {
    //if (req.user) {
      next() 
    // } else {
    //   res.redirect('/')
    // }
  }
  return { getTokens, middleware}
}

module.exports = yahooController