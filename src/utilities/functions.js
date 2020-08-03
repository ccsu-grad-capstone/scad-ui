/* eslint-disable eqeqeq */

// players: (array) scad players
// id: (string) yahoo player_id
// Finding SCAD player when starting with YAHOO player
export function getScadPlayer (players, id) {
  return players ? players.find(p => p.yahooLeaguePlayerId == id) : undefined
}

// players: (array) yahoo players
// id: (int) yahoo player_id
// Finding YAHOO player when starting with SCAD player
export function getYahooPlayer (players, id) {
  return players ? players.find(p => p.player_id == id) : undefined
}

// leagues: (array) scad leagues
// id: (string) yahoo league_id
// Finding SCAD league when starting with YAHOO league id
export function getScadLeague (leagues, id) {
  return leagues ? leagues.find(l => l.yahooLeagueId == id) : undefined
}

// leagues: (array) yahoo leagues
// id: (string) yahoo league_id
// Finding SCAD league when starting with SCAD league id
export function getYahooLeague (leagues, id) {
  return leagues ? leagues.find(l => l.league_id == id) : undefined
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

export function getHeadshot (id, yahooPlayers) {
  let player = getYahooPlayer(yahooPlayers, id)
  return player ? player.headshot.url : undefined
}

export function getPos (id, yahooPlayers) {
  let player = getYahooPlayer(yahooPlayers, id)
  return player ? player.display_position : undefined
}

export function getPlayerName (id, yahooPlayers) {
  let player = getYahooPlayer(yahooPlayers, id)
  return player ? player.name.full : undefined
}

export function getNFLTeam (id, yahooPlayers) {
  let player = getYahooPlayer(yahooPlayers, id)
  return player ? player.editorial_team_full_name : undefined
}

export function getOwner (id, yahooTeams) {
  let yahooTeam = yahooTeams.find(t => t.team_id == id)
  return yahooTeam ? yahooTeam.name : undefined
}

export function searchFilter (id, yahooPlayers, filter) {
  let player = getYahooPlayer(yahooPlayers, id)
  return player.name.full.toLowerCase().includes(filter['search'].toLowerCase())
}

export function positionFilter (id, yahooPlayers, filter) {
  let player = getYahooPlayer(yahooPlayers, id)
  return player.display_position === filter['position']
}

export function isFranchiseTagged (id, scadTeam) {
  let scadPlayer = getScadPlayer(scadTeam.players, id)
  if (scadPlayer) {
    return scadPlayer.isFranchiseTag
  } else return false
}

export function getPlayerPrevSalary (id, scadTeam) {
  let player = getScadPlayer(scadTeam.players, id)
  return player ? player.previousYearSalary : undefined
}

export function getOriginalSalary (id, scadTeam) {
  let player = getScadPlayer(scadTeam.players, id)
  return player ? player.salary : undefined
}
