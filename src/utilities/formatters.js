/* eslint-disable eqeqeq */
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
