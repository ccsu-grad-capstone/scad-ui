/* eslint-disable eqeqeq */

// players: (array) scad players
// id: (string) yahoo player_id
// Finding SCAD player when starting with YAHOO player
export function getScadPlayer (players, id) {
  if (players) {
    return players.find(p => p.yahooLeaguePlayerId == id)
  }
}

// players: (array) yahoo players
// id: (int) yahoo player_id
// Finding YAHOO player when starting with SCAD player
export function getYahooPlayer (players, id) {
  if (players) {
    return players.find(p => p.player_id == id)
  }
}

// rosterPositions: (array) yahoo league settings for positions
// Returns the total number of roster spots, excluding IR
export function getLeagueRosterLimit (rosterPositions) {
  if (rosterPositions && Array.isArray(rosterPositions)) {
    let count = 0
    rosterPositions.forEach(pos => {
      if (pos.roster_position.position !== 'IR') {
        count += pos.roster_position.count
      }
    })
    return count
  }
}
