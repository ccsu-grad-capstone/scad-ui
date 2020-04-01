const debug = require('debug')('app:draftPicksController')

function draftPicks() {

  async function getAllByLeague (league) {
    debug(leage)
  }

  async function create (dp) {
    debug(dp)
  }
  
  async function update (id, dp) {
    debug(dp)
  }
  
  async function remove (id) {
    debug(id)
  }

  return { create, update, remove, getAllByLeague }
}

module.exports = draftPicks()