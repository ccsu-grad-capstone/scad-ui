import notify from './nofity'

/* eslint-disable eqeqeq */
function calcTeamSalary (yahooPlayers, scadPlayers, capExemptions, franchiseTagDiscount, irRelieftPerc, yahooTeam, year) {
  let salary = 0
  // console.log(yahooPlayers)
  // console.log(scadPlayers)
  // console.log(capExemptions)
  // console.log(franchiseTagDiscount)
  // console.log(irRelieftPerc)
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

function calcPlayerSalary (id, pos, scadPlayers, franchiseTagDiscount, irRelieftPerc, yahooTeam) {
  let player = scadPlayers.find(p => p.yahooLeaguePlayerId == id)
  if (player) {
    let salary = player.salary
    if (player.isFranchiseTag) {
      return calcFranchiseTagSalary(salary, franchiseTagDiscount)
    } else if (pos === 'IR') {
      return calcIrSalary(salary, irRelieftPerc)
    } else {
      if (salary === 0) {
        notify.salaryUpdateOnPlayerRequired(yahooTeam.name)
      }
      return player.salary
    }
  } else {
    notify.salaryUpdateOnPlayerRequired(yahooTeam.name)
    return 0
  }
}

function calcFranchiseTagSalary (salary, franchiseTagDiscount) {
  if (salary <= franchiseTagDiscount) {
    return 0
  } else {
    return (salary -= franchiseTagDiscount)
  }
}

function calcIrSalary (salary, irReliefPerc) {
  salary = salary * irReliefPerc
  if (Number.isInteger(salary)) {
    return salary
  } else {
    return Math.round(salary)
  }
}

export { calcTeamSalary, calcPlayerSalary, calcFranchiseTagSalary, calcIrSalary }
