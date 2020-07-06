/* eslint-disable eqeqeq */
import { getPosCount } from './calculator'

// pos: player's position
// Returns boolean depending if user's position is IR
export function isIR (pos) {
  if (pos === 'IR') { return true } else { return false }
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
  if (league && !registered) {
    return true
  } else {
    return false
  }
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
    } else {
      return false
    }
  } else { return false }
}
