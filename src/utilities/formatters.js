/* eslint-disable eqeqeq */
export function myTeamStyle (id, myYahooTeamId) {
  return {
    'text-accent': id == myYahooTeamId,
    'text-weight-bold': id == myYahooTeamId
  }
}
