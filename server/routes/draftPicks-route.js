const express = require('express')
const draftPicks = require('../controllers/draftPicks')
const debug = require('debug')('app:draftPicksRouter')

const draftPicksRouter = express.Router()

function middleware(req, res, next) {
  next()
}

function router() {
  draftPicksRouter.use(middleware)

  function getAllByLeague (req, res) {
    const { league } = req.query
    debug('getAllByLeague')
    try {
      draftPicks.getAllByLeague(league)
    } catch (error) {
      console.log(error)
    }
  }

  function create (req, res) {
    const dp = req.body
    debug('create: ', dp)
    if (dp) {
      try {
        draftPicks.create(dp)
      } catch (error) {
        console.log(error)
      }
    }
  }

  function update (req, res) {
    const { id } = req.query
    debug('update')
    try {
      draftPicks.update(id)
    } catch (error) {
      console.log(error)
    }
  }

  function remove (req, res) {
    const { id } = req.query
    debug('remove')
    try {
      draftPicks.remove(id)
    } catch (error) {
      console.log(error)
    }
  }

  draftPicksRouter.get('/:league', getAllByLeague)
  draftPicksRouter.post('/create', create)
  draftPicksRouter.post('/update:id', update)
  draftPicksRouter.delete('/remove:id', remove)

  return draftPicksRouter
}

module.exports = router()
