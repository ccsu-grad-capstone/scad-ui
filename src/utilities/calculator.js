/* eslint-disable eqeqeq */
function calcTeamSalary (yahooPlayers, scadPlayers, capExemptions, yahooTeamId, franchiseTagDiscount, irRelieftPerc) {
  let salary = 0
  console.log(yahooPlayers)
  console.log(scadPlayers)
  console.log(capExemptions)
  console.log(yahooTeamId)
  console.log(franchiseTagDiscount)
  console.log(irRelieftPerc)
  yahooPlayers.forEach(p => {
    salary += calcPlayerSalary(p.player_id, p.selected_position.position, scadPlayers, franchiseTagDiscount, irRelieftPerc)
  })
  console.log('salary', salary)
  if (capExemptions) {
    capExemptions.forEach(ce => {
      if (ce.yahooTeamGive.team_id === yahooTeamId) {
        salary += ce.amount
      } else { salary -= ce.amount }
    })
  }
  console.log('salary', salary)

  return salary
}

function calcPlayerSalary (id, pos, scadPlayers, franchiseTagDiscount, irRelieftPerc) {
  let player = scadPlayers.find(p => p.yahooLeaguePlayerId == id)
  let salary = player.salary
  if (player.isFranchiseTag) {
    return calcFranchiseTagSalary(salary, franchiseTagDiscount)
  } else if (pos === 'IR') {
    return calcIrSalary(salary, irRelieftPerc)
  } else {
    return player.salary
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
  return salary
}

module.exports = { calcTeamSalary, calcPlayerSalary, calcFranchiseTagSalary, calcIrSalary }
