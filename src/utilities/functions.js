/* eslint-disable eqeqeq */

// Finding SCAD player when starting with YAHOO player
export function getScadPlayer (players, id) {
  // console.log('getScadPlayer')
  return players.find(p => p.yahooLeaguePlayerId == id)
}

// Finding YAHOO player when starting with SCAD player
export function getYahooPlayer (players, id) {
  // console.log('getScadPlayer')
  return players.find(p => p.player_id == id)
}

// Returns the total number of roster spots, excluding IR
export function getLeagueRosterLimit (rosterPositions) {
  let count = 0
  rosterPositions.forEach(pos => {
    if (pos.roster_position.position !== 'IR') {
      count += pos.roster_position.count
    }
  })
  return count
}
