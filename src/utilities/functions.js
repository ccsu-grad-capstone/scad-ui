/* eslint-disable eqeqeq */
export function getScadPlayer (players, id) {
  // console.log('getScadPlayer')
  return players.find(p => p.yahooLeaguePlayerId == id)
}

export function getYahooPlayer (players, id) {
  // console.log('getScadPlayer')
  return players.find(p => p.player_id == id)
}
