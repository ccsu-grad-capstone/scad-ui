export function isIR (pos) {
  if (pos === 'IR') { return true } else { return false }
}

export function isCommish (id, yahooCommishLeagues, scadLeagues) {
  let league = yahooCommishLeagues.find(l => l.league_id === id)
  // eslint-disable-next-line eqeqeq
  let registered = scadLeagues.find(l => l.yahooLeagueId == id)
  if (league && !registered) {
    return true
  } else {
    return false
  }
}
