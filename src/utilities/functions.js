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

// leagues: (array) scad leagues
// id: (string) yahoo league_id
// Finding SCAD league when starting with YAHOO league id
export function getScadLeague (leagues, id) {
  if (leagues) {
    return leagues.find(l => l.yahooLeagueId == id)
  }
}

// leagues: (array) yahoo leagues
// id: (string) yahoo league_id
// Finding SCAD league when starting with SCAD league id
export function getYahooLeague (leagues, id) {
  if (leagues) {
    return leagues.find(l => l.league_id == id)
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

export function getYears (year) {
  let years = []
  if (year) {
    for (let i = 0; i < 5; i++) {
      years.push(year + i)
    }
  }
  return years
}
