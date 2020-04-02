const debug = require('debug')('app:draftPicksController')

const DraftPick = require('../models/DraftPick')


async function getAllByLeague (leagueID) {
  debug('Getting all draft picks by league: ', )
  try {
    return await DraftPick.find( {yahooLeagueID: leagueID} ).sort( { ownerID: 1 } )
  } catch (error) {
    debug(error)
  }
}

async function create (dp) {
  debug('Creating new DraftPick')
  try {
    return new DraftPick(dp).save()
  } catch (error) {
    debug(error)
  }
}

async function update (id, dp) {
  debug('Updating DraftPick: ', id)
  try {
    return new DraftPick(dp).save()
  } catch (error) {
    debug(error)
  }
}

async function remove (id) {
  debug('Removing DraftPick: ', id)
  try {
    return new DraftPick(dp).save()
  } catch (error) {
    debug(error)
  }
}


module.exports = { getAllByLeague, create, update, remove }