/* eslint-disable eqeqeq */
import { getPosCount } from './calculator'
import { getScadPlayer } from './functions'

// pos: player's position
// Returns boolean depending if user's position is IR
export function isIR (pos) {
  return (pos === 'IR')
}

// id: current yahoo league id
// yahooCommishLeagues: array of users league they're a commissioner of
// scadLeagues: array of user's scad leagues
// Returns true if user is a commish and league isn't registered
export function isCommishNotRegistered (id, yahooCommishLeagues, scadLeagues) {
  let league
  let registered
  if (yahooCommishLeagues && scadLeagues) {
    league = yahooCommishLeagues.find(l => l.league_id == id)
    registered = scadLeagues.find(l => l.yahooLeagueId == id)
  }
  return !!((league && !registered))
}

// pos: position
// scadSettings: league's scad settings
// players: array of yahoo players
// Returns true if position count is within scad settings for pos, false otherwise
export function checkPos (pos, scadSettings, players) {
  if (scadSettings && players) {
    let count = getPosCount(pos.toUpperCase(), players)
    if ((count <= scadSettings[`${pos.toLowerCase()}Max`]) && (count >= scadSettings[`${pos.toLowerCase()}Min`])) {
      return true
    } else { return false }
  } else { return false }
}

export function isScadPlayer (id, scadTeam) {
  let scadPlayer = getScadPlayer(scadTeam.roster, id)
  return !!scadPlayer
}

export function checkIRCount (players) {
  let count = 0
  players.forEach(p => {
    if (p.selected_position === 'IR') {
      if (p.status) {
        if (p.status.includes('IR') || p.status.includes('PUP-R')) count++
      } else count++
    }
  })
  if (count <= 3) return true
  else return false
}

export function checkCovidCount (players) {
  let count = 0
  players.forEach(p => {
    if (p.selected_position === 'IR' && p.status && p.status.includes('COVID')) {
      count++
    }
  })
  if (count <= 7) return true
  else return false
}

export function checkIfCommish (yahooLeagueId, yahooCommishLeagues) {
  if (yahooLeagueId && yahooCommishLeagues) {
    for (const yl of yahooCommishLeagues) {
      if (yl.league_id === yahooLeagueId) return true
    }
  }
  return false
}

export function checkToLogEOYSalaries (yahooLeagueDetails, endOfSeasonPlayerHistory) {
  if (yahooLeagueDetails && endOfSeasonPlayerHistory) {
    if (yahooLeagueDetails.is_finished === 1 && yahooLeagueDetails.season) {
      if (!endOfSeasonPlayerHistory.includes(yahooLeagueDetails.season)) return true
    }
  }
  return false
}
