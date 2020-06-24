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
function calcTeamSalary (yahooPlayers, scadPlayers, capExemptions, franchiseTagDiscount, irRelieftPerc, yahooTeam, year) {
  let salary = 0
  yahooPlayers.forEach(p => {
    salary += calcPlayerSalary(p.player_id, p.selected_position.position, scadPlayers, franchiseTagDiscount, irRelieftPerc, yahooTeam)
  })
  if (capExemptions) {
    capExemptions.forEach(ce => {
      if (year == ce.year) {
        if (ce.yahooTeamGive.team_id === yahooTeam.team_id) {
          salary += ce.amount
        } else { salary -= ce.amount }
      }
    })
  }
  return salary
}

// id: player's yahoo player_id
// pos: position of player
// scadPlayers: array of team's scadPlayers
// franchiseTagdiscount: SCAD league setting for discount on franchise tag
// irReliefPerc: SCAD league setting for discount on irReliefPerc
// Calculates player salary by checking if they're franchise tagged or on IR
function calcPlayerSalary (id, pos, scadPlayers, franchiseTagDiscount, irRelieftPerc) {
  let player = scadPlayers.find(p => p.yahooLeaguePlayerId == id)
  if (player) {
    let salary = player.salary
    if (player.isFranchiseTag) {
      return calcFranchiseTagSalary(salary, franchiseTagDiscount)
    } else if (pos === 'IR') {
      return calcIrSalary(salary, irRelieftPerc)
    } else {
      if (salary === 0) {
        // notify.salaryUpdateOnPlayerRequired(yahooTeam.name)
      }
      return player.salary
    }
  } else {
    // notify.salaryUpdateOnPlayerRequired(yahooTeam.name)
    return 0
  }
}

// salary: players original salary
// franchiseTagdiscount: SCAD league setting for discount on franchise tag
// Returns player salary if they're on Franchise Tag.
function calcFranchiseTagSalary (salary, franchiseTagDiscount) {
  if (salary <= franchiseTagDiscount) {
    return 0
  } else {
    return (salary -= franchiseTagDiscount)
  }
}

// salary: players original salary
// irReliefPerc: SCAD league setting for discount on irReliefPerc
// Returns player salary if they're on the IR
function calcIrSalary (salary, irReliefPerc) {
  salary = salary * irReliefPerc
  if (Number.isInteger(salary)) {
    return salary
  } else {
    return Math.round(salary)
  }
}

export { calcTeamSalary, calcPlayerSalary, calcFranchiseTagSalary, calcIrSalary }
