// import notify from './nofity'

/* eslint-disable eqeqeq */

// yahooPlayers: array of team's yahooPlayers
// scadPlayers: array of team's scadPlayers
// capExcemptions: array of team's CE
// franchiseTagdiscount: SCAD league setting for discount on franchise tag
// irReliefPerc: SCAD league setting for discount on irReliefPerc
// yahooTeam: team's yahoo info
// year: current year of league
// Returns total team salary.  Adds player salaries and cap exceptions
export function calcTeamSalary (yahooPlayers, scadPlayers, capExemptions, franchiseTagDiscount, irRelieftPerc, yahooTeam, year) {
  let salary = 0
  if (yahooPlayers && scadPlayers && capExemptions && franchiseTagDiscount && irRelieftPerc && yahooTeam && year) {
    yahooPlayers.forEach(p => {
      salary += calcPlayerSalary(p.player_id, p.selected_position.position, scadPlayers, franchiseTagDiscount, irRelieftPerc)
    })
    if (capExemptions) {
      capExemptions.forEach(ce => {
        if (year == ce.year) {
          if (ce.yahooTeamGive.team_id == yahooTeam.team_id) {
            salary += ce.amount
          } else { salary -= ce.amount }
        }
      })
    }
  }
  return salary
}

// id: player's yahoo player_id
// pos: position of player
// scadPlayers: array of team's scadPlayers
// franchiseTagdiscount: SCAD league setting for discount on franchise tag
// irReliefPerc: SCAD league setting for discount on irReliefPerc
// Calculates player salary by checking if they're franchise tagged or on IR
export function calcPlayerSalary (id, pos, scadPlayers, franchiseTagDiscount, irRelieftPerc) {
  if (id && pos && scadPlayers && franchiseTagDiscount && irRelieftPerc >= 0) {
    let player = scadPlayers.find(p => p.yahooLeaguePlayerId == id)
    if (player) {
      let salary = player.salary
      if (player.isFranchiseTag) {
        salary = calcFranchiseTagSalary(salary, franchiseTagDiscount)
      }
      if (pos.toUpperCase() === 'IR') {
        salary = calcIrSalary(salary, irRelieftPerc)
      }
      return salary
    } else {
      // notify.salaryUpdateOnPlayerRequired(yahooTeam.name)
      return 0
    }
  }
}

// salary: players original salary
// franchiseTagdiscount: SCAD league setting for discount on franchise tag
// Returns player salary if they're on Franchise Tag.
export function calcFranchiseTagSalary (salary, franchiseTagDiscount) {
  if (salary && franchiseTagDiscount) {
    if (salary <= franchiseTagDiscount) {
      return 0
    } else {
      return (salary -= franchiseTagDiscount)
    }
  } else { return salary }
}

// salary: players original salary
// irReliefPerc: SCAD league setting for discount on irReliefPerc
// Returns player salary if they're on the IR
export function calcIrSalary (salary, irReliefPerc) {
  if (salary && irReliefPerc > 0) {
    salary -= salary * irReliefPerc / 100
    if (Number.isInteger(salary)) {
      return salary
    } else {
      return Math.round(salary)
    }
  } else if (salary && irReliefPerc == 0) {
    return salary
  } else { return salary }
}

// pos: player's position
// players: array of yahooPlayers
// Returns the number of players in players array for a specific position
export function getPosCount (pos, players) {
  let count = 0
  if (players) {
    players.forEach(p => {
      if (p.display_position.toUpperCase() === pos.toUpperCase()) {
        if (p.selected_position.position.toUpperCase() !== 'IR') {
          count++
        }
      }
    })
  }
  return count
}

// players: array of yahooPlayers
// Returns total count of players in players array that are not on IR
export function getPlayerCount (players) {
  let count = 0
  if (players) {
    players.forEach(p => {
      if (p.selected_position.position !== 'IR') { count++ }
    })
  }
  return count
}

// pos: player's position
// players: array of yahooPlayers
// scadPlayers: array of team's scadPlayers
// franchiseTagdiscount: SCAD league setting for discount on franchise tag
// irReliefPerc: SCAD league setting for discount on irReliefPerc
// Returns the total salary for players in players array for a specific position
export function getPositionSalaryTotal (pos, players, scadPlayers, franchiseTagDiscount, irReliefPerc) {
  let total = 0
  if (pos && players && scadPlayers && franchiseTagDiscount && irReliefPerc >= 0) {
    players.forEach(p => {
      if (p.display_position.toUpperCase() === pos.toUpperCase()) {
        let position
        if (p.selected_position.position.toUpperCase() === 'IR') {
          position = 'IR'
        } else {
          position = p.display_position.toUpperCase()
        }
        let salary = calcPlayerSalary(p.player_id, position, scadPlayers, franchiseTagDiscount, irReliefPerc)
        total += salary
      }
    })
  }
  return total
}

// salary: teams total salary
// pos: player's position
// players: array of yahooPlayers
// scadPlayers: array of team's scadPlayers
// franchiseTagdiscount: SCAD league setting for discount on franchise tag
// irReliefPerc: SCAD league setting for discount on irReliefPerc
// Returns the percentage a team is spending on each position
export function getPerc (salary, pos, players, scadPlayers, franchiseTagDiscount, irReliefPerc) {
  return ((getPositionSalaryTotal(pos, players, scadPlayers, franchiseTagDiscount, irReliefPerc) / salary) * 100).toFixed(0)
}
