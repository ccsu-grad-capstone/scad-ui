const express = require('express')
const draftPicks = require('../controllers/draftPicks')
const debug = require('debug')('app:draftPicksRouter')

const draftPicksRouter = express.Router()

function router() {
  const { redirectToYahoo, getAccessTokens, refreshToken, middleware } = yahooController(yahooOauth)
  draftPicksRouter.use(middleware)

  function create (req, res) {
    const dp = req.body
    debug('dp: ', dp)
  }

  draftPicksRouter.post('/', create)

  return draftPicksRouter
}

module.exports = router()
