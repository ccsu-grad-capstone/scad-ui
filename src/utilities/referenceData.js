export default {
  booleans: [true, false],
  rookieDraftRounds: [1, 2, 3, 4, 5],
  rookieDraftStrategy: ['Message Board', 'Offline'],
  rookieWageScale: ['Standard', 'Need other options'],
  tradingDraftPickYears: [1, 2, 3, 4, 5, 6, 7, 'No Limit'],
  position: ['QB', 'RB', 'WR', 'TE', 'RB/WR/TE', 'K', 'DEF'],
  positionChecks: ['qb', 'rb', 'wr', 'te', 'k', 'def'],
  rosterLimits: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'No Limit'],
  franchiseTags: [0, 1],
  years: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030],
  rounds: [1, 2, 3],
  twelveTeams: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  teamSalaryCap () {
    var list = []
    for (var i = 100; i <= 1000; i += 5) {
      list.push(i)
    }
    return list
  },
  salaryCapExemptionLimit () {
    var list = []
    for (var i = 0; i <= 100; i += 5) {
      list.push(i)
    }
    return list
  },
  irReliefPerc () {
    var list = []
    for (var i = 0; i <= 100; i += 5) {
      list.push(i)
    }
    return list
  },
  franchiseTagDiscount () {
    var list = []
    for (var i = 0; i <= 50; i += 1) {
      list.push(i)
    }
    return list
  }

}
