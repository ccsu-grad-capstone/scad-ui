/* eslint-disable eqeqeq */

import moment from 'moment'
import { getYahooPlayer, getTeamGuid, getDisplayPosition } from './functions'

export function myTeamStyle (yahooPlayerId, yahooTeams, yahooPlayers, userGuid) {
  let player = getYahooPlayer(yahooPlayers, yahooPlayerId)
  if (player) {
    let yahooTeam = yahooTeams.find(t => t.team_id == player.yahooTeamId)
    return {
      'text-accent': getTeamGuid(yahooTeam) == userGuid,
      'text-weight-bold': getTeamGuid(yahooTeam) == userGuid
    }
  }
}

export function myTeamDPCEStyle (teamGuid, userGuid) {
  return {
    'text-accent': teamGuid == userGuid,
    'text-weight-bold': teamGuid == userGuid
  }
}
export function fmt (row, col, viewByPos) {
  let displayPosition = getDisplayPosition(row.display_position)
  if (row.selected_position === 'IR') {
    return {
      'text-red': row.selected_position === 'IR',
      'bg-red-1': row.selected_position === 'IR'
    }
  } else {
    return {
      'text-primary': col === 'salary',
      'text-grey': col === 'previousSalary' || col === 'team',
      'text-weight-bold': col === 'pos' || col === 'playerName',
      'bg-grey-3': (row.selected_position === 'BN' && !viewByPos) || (displayPosition === 'WR' && viewByPos) || (displayPosition === 'TE' && viewByPos)
    }
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
