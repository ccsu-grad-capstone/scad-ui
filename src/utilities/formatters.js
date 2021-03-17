/* eslint-disable eqeqeq */

import moment from 'moment'
import { getYahooPlayer } from './functions'

export function myTeamStyle (yahooPlayerId, yahooTeams, yahooPlayers, myYahooTeamId) {
  let player = getYahooPlayer(yahooPlayers, yahooPlayerId)
  let yahooTeam = yahooTeams.find(t => t.team_id == player.yahooTeamId)
  return {
    'text-accent': yahooTeam.team_id == myYahooTeamId,
    'text-weight-bold': yahooTeam.team_id == myYahooTeamId
  }
}
export function fmt (row, col, viewByPos) {
  return {
    'text-primary': col === 'salary',
    'text-grey': col === 'previousSalary' || col === 'team',
    'text-weight-bold': col === 'pos' || col === 'playerName',
    'text-red': row.selected_position === 'IR',
    'bg-grey-3': (row.selected_position === 'BN' && !viewByPos) || (row.display_position === 'WR' && viewByPos) || (row.display_position === 'TE' && viewByPos),
    'bg-red-1': row.selected_position === 'IR'
  }
}

export function displayTeamName (team) {
  return team ? team.name : ''
}

export function displayPick (pick) {
  return pick || '-'
}

export function outputRound (rd) {
  if (rd === 1) {
    return '1st'
  } else if (rd === 2) {
    return '2nd'
  } else if (rd === 3) {
    return '3rd'
  } else if (rd === 4) {
    return '4th'
  }
}

export function fmtCeDate (date) {
  return moment(date).format('LLL')
}
