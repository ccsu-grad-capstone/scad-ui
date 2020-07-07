/* eslint-disable eqeqeq */

import moment from 'moment'

export function myTeamStyle (id, myYahooTeamId) {
  return {
    'text-accent': id == myYahooTeamId,
    'text-weight-bold': id == myYahooTeamId
  }
}
export function fmt (pos, col, ft) {
  return {
    'text-primary': col === 'salary',
    'text-grey': col === 'previousSalary' || col === 'team',
    'text-weight-bold': col === 'pos' || col === 'playerName',
    'text-red': pos === 'IR',
    'bg-grey-3': pos === 'BN',
    'bg-red-1': pos === 'IR'
  }
}

export function displayTeamName (team) {
  return team ? team.name : ''
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
