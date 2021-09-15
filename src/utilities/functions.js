/* eslint-disable eqeqeq */

// players: (array) scad players
// id: (string) yahoo player_id
// Finding SCAD player when starting with YAHOO player
export function getScadPlayer (players, id) {
  return players ? players.find(p => p.yahooPlayerId == id) : undefined
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
// Finding YAHOO league when starting with SCAD league id
export function getYahooLeague (leagues, id) {
  return leagues ? leagues.find(l => l.league_id == id) : undefined
}

// teams: (array) scad teams
// id: (string) yahoo team_id
// Finding SCAD team when starting with YAHOO team id
export function getScadTeam (teams, id) {
  return teams ? teams.find(t => t.yahooTeamId == id) : undefined
}

// rosterPositions: (array) yahoo league settings for positions
// Returns the total number of roster spots, excluding IR
export function getLeagueRosterLimit (rosterPositions) {
  if (rosterPositions && Array.isArray(rosterPositions)) {
    let count = 0
    rosterPositions.forEach(pos => {
      if (pos.position !== 'IR') {
        count += pos.count
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

export function getOwner (yahooPlayerId, yahooTeams, yahooPlayers) {
  let player = getYahooPlayer(yahooPlayers, yahooPlayerId)
  if (player) {
    let yahooTeam = yahooTeams.find(t => t.team_id == player.yahooTeamId)
    return yahooTeam || undefined
  } else return undefined
}

export function searchFilter (id, yahooPlayers, filter) {
  let player = getYahooPlayer(yahooPlayers, id)
  if (player) return player.name.full.toLowerCase().includes(filter['search'].toLowerCase())
}

export function positionFilter (id, yahooPlayers, filter) {
  let player = getYahooPlayer(yahooPlayers, id)
  if (player) return player.display_position === filter['position']
}

export function isFranchiseTagged (id, scadTeam) {
  let scadPlayer = getScadPlayer(scadTeam.roster, id)
  return scadPlayer ? scadPlayer.isFranchiseTag : false
}

export function isPreseasonIR (id, scadTeam) {
  let scadPlayer = getScadPlayer(scadTeam.roster, id)
  if (scadPlayer && scadPlayer.preseasonIR) return scadPlayer.preseasonIR
  else return false
}

export function getPlayerPrevSalary (id, scadTeam) {
  let player = getScadPlayer(scadTeam.roster, id)
  return player ? player.previousYearSalary : undefined
}

export function getOriginalSalary (id, scadTeam) {
  let player = getScadPlayer(scadTeam.roster, id)
  return player ? player.salary : undefined
}

export function getGameKey (leagueKey) {
  if (leagueKey && leagueKey.includes('.')) {
    let split = leagueKey.split('.')
    return split[0]
  } else if (leagueKey && leagueKey.length === 3) {
    return leagueKey
  } else {
    return ''
  }
}

export function getPlayerHistoryLog (salary, type, team, userName, franchiseTag) {
  // console.log('getPlayerHistoryLog')
  let log
  if (type === 'Waivers' || type === 'FA') {
    log = `Added to ${team.name} (${team.managers[0].nickname}) for $${salary} from ${type}`
  } else if (type === 'Manual') {
    if (franchiseTag) {
      log = `Franchise tagged to discounted salary of ${salary} by ${userName}`
    } else {
      log = `Manual salary adjustment to $${salary} by ${userName}`
    }
  }
  console.log(log)
  return log
}

// teams: (array) yahoo teams
// id: (string) yahoo team_id
// Finding SCAD team when starting with YAHOO team id
export function getYahooTeamFromYahooTeamId (teams, id) {
  return teams ? teams.find(t => t.team_id == id) : undefined
}

export function getSalaryForCatch (t, p) {
  if (p.transaction.type === 'add') {
    return t.faab_bid ? t.faab_bid : 1
  } else if (p.transaction.type === 'drop') {
    return 0
  }
}

export function getTeamGuid (team) {
  if (team.managers[0].manager) {
    return team.managers[0].manager.guid
  } else if (team.managers[0].guid) return team.managers[0].guid
}

export function getDisplayPosition (disPos) {
  if (disPos.includes(',')) {
    let positions = disPos.split(',')
    if (positions.includes('TE')) {
      return 'TE'
    } else return positions[1]
  } else return disPos
}
