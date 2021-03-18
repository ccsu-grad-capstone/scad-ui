import { calcTeamSalary, calcPlayerSalary, calcFranchiseTagSalary, calcIrSalary, getPosCount, getPlayerCount, getPositionSalaryTotal, getPerc } from '../../src/utilities/calculator'
import { scadPlayers, yahooPlayers, scadLeague, yahooTeam, capExceptionsByTeam } from '../data/testData.json'

describe('calculator.js Test Suite', () => {
  describe('calcTeamSalary tests', () => {
    it('should properly return salary', () => {
      expect(calcTeamSalary(yahooPlayers, scadPlayers, [], 25, 50, yahooTeam, 2020)).toBe(211)
      expect(calcTeamSalary(yahooPlayers, scadPlayers, capExceptionsByTeam, 25, 50, yahooTeam, 2020)).toBe(221)
      let ceTeam = capExceptionsByTeam
      let ce = {
        'prevLeagueIds': [],
        '_id': '5ef24dd227478e00248c8975',
        'yahooLeagueId': 13088,
        'yahooLeagueYear': 2020,
        'year': 2020,
        'timestamp': '2020-06-23T18:45:38.863Z',
        'addedBy': 'Ryan Lauzon',
        'yahooTeamGive':
        { 'team_id': 1 },
        'yahooTeamRecieve':
        { 'team_id': 2 },
        'amount': 5,
        'appliedToTeams': true,
        'comments': '',
        '__v': 0
      }
      ceTeam.push(ce)
      expect(calcTeamSalary(yahooPlayers, scadPlayers, ceTeam, 25, 50, yahooTeam, 2020)).toBe(216)
    })
    it('should handle undefined cases properly', () => {
      expect(calcTeamSalary(yahooPlayers, yahooPlayers, undefined, 25)).toBe(0)
      expect(calcTeamSalary(yahooPlayers, yahooPlayers, [], 25, 50, yahooTeam, 2020)).toBe(0)
      expect(calcTeamSalary(yahooPlayers, scadPlayers, [], undefined, 50, yahooTeam, 2020)).toBe(0)
      expect(calcTeamSalary(yahooPlayers, scadPlayers, [], 25, 50, undefined, 2020)).toBe(0)
      expect(calcTeamSalary(undefined)).toBe(0)
      expect(calcTeamSalary()).toBe(0)
    })
  })

  describe('calcPlayerSalary tests', () => {
    it('should properly return salary', () => {
      expect(calcPlayerSalary(27540, 'WR', scadPlayers, 25, 50)).toBe(42)
      expect(calcPlayerSalary(27540, 'IR', scadPlayers, 25, 50)).toBe(21)
      expect(calcPlayerSalary(31379, 'RB', scadPlayers, 25, 50)).toBe(16)
      expect(calcPlayerSalary(31379, 'WR', scadPlayers, 25, 50)).toBe(16)
      expect(calcPlayerSalary(31379, 'IR', scadPlayers, 25, 50)).toBe(8)
      expect(calcPlayerSalary(31379, 'IR', scadPlayers, 25, 40)).toBe(10)
      expect(calcPlayerSalary(11, 'RB', scadPlayers, 25, 40)).toBe(0)
    })
    it('should handle undefined cases properly', () => {
      expect(calcPlayerSalary(31379, undefined)).toBeUndefined()
      expect(calcPlayerSalary(undefined, 10)).toBeUndefined()
      expect(calcPlayerSalary()).toBeUndefined()
      expect(calcPlayerSalary('')).toBeUndefined()
    })
  })

  describe('calcFranchiseTagSalary tests', () => {
    it('should properly return salary', () => {
      expect(calcFranchiseTagSalary(100, 25)).toBe(75)
      expect(calcFranchiseTagSalary(25, 25)).toBe(0)
      expect(calcFranchiseTagSalary(10, 25)).toBe(0)
      expect(calcFranchiseTagSalary(10, 50)).toBe(0)
      expect(calcFranchiseTagSalary(50, 22)).toBe(28)
      expect(calcFranchiseTagSalary('50', 22)).toBe(28)
      expect(calcFranchiseTagSalary(50, '22')).toBe(28)
      expect(calcFranchiseTagSalary('50', '22')).toBe(28)
    })
    it('should handle undefined cases properly', () => {
      expect(calcFranchiseTagSalary(12, undefined)).toBe(12)
      expect(calcFranchiseTagSalary(undefined, 10)).toBeUndefined()
      expect(calcFranchiseTagSalary()).toBeUndefined()
      expect(calcFranchiseTagSalary('')).toBe('')
    })
  })

  describe('calcIrSalary tests', () => {
    it('should properly return salary', () => {
      expect(calcIrSalary(12, 50)).toBe(6)
      expect(calcIrSalary('12', 50)).toBe(6)
      expect(calcIrSalary(12, '50')).toBe(6)
      expect(calcIrSalary('12', '50')).toBe(6)
      expect(calcIrSalary(100, 25)).toBe(75)
      expect(calcIrSalary(10, 25)).toBe(8)
      expect(calcIrSalary(22, 7)).toBe(20)
      expect(calcIrSalary(100, 90)).toBe(10)
      expect(calcIrSalary(12, 0)).toBe(12)
      expect(calcIrSalary(100, 1)).toBe(99)
    })
    it('should handle undefined cases properly', () => {
      expect(calcIrSalary(12, undefined)).toBe(12)
      expect(calcIrSalary(undefined, 10)).toBeUndefined()
      expect(calcIrSalary()).toBeUndefined()
      expect(calcIrSalary('')).toBe('')
    })
  })

  describe('getPosCount tests', () => {
    it('should properly return salary', () => {
      expect(getPosCount('QB', yahooPlayers)).toBe(3)
      expect(getPosCount('def', yahooPlayers)).toBe(2)
      expect(getPosCount('TE', yahooPlayers)).toBe(4)
    })
    it('should properly return 0', () => {
      expect(getPosCount(scadPlayers)).toBe(0)
      expect(getPosCount()).toBe(0)
      expect(getPosCount(undefined)).toBe(0)
    })
  })

  describe('getPlayerCount tests', () => {
    it('should properly return count', () => {
      expect(getPlayerCount(yahooPlayers)).toBe(24)
    })
    it('should properly return 0', () => {
      expect(getPlayerCount(undefined)).toBe(0)
    })
  })

  describe('getPositionSalaryTotal tests', () => {
    it('should properly return proper dollar amount', () => {
      expect(getPositionSalaryTotal('QB', yahooPlayers, scadPlayers, scadLeague.franchiseTagDiscount, scadLeague.irReliefPerc)).toBe(9)
      expect(getPositionSalaryTotal('QB', yahooPlayers, scadPlayers, scadLeague.franchiseTagDiscount, 0)).toBe(9)
      expect(getPositionSalaryTotal('qb', yahooPlayers, scadPlayers, scadLeague.franchiseTagDiscount, scadLeague.irReliefPerc)).toBe(9)
      expect(getPositionSalaryTotal('TE', yahooPlayers, scadPlayers, scadLeague.franchiseTagDiscount, scadLeague.irReliefPerc)).toBe(11)
    })
    it('should return 0', () => {
      expect(getPositionSalaryTotal('QB', undefined, scadPlayers, scadLeague.franchiseTagDiscount, scadLeague.irReliefPerc)).toBe(0)
      expect(getPositionSalaryTotal('QB', undefined, undefined, scadLeague.franchiseTagDiscount, scadLeague.irReliefPerc)).toBe(0)
      expect(getPositionSalaryTotal('QB')).toBe(0)
      expect(getPositionSalaryTotal()).toBe(0)
      expect(getPositionSalaryTotal('')).toBe(0)
    })
  })

  describe('getPerc tests', () => {
    it('should properly return percentage', () => {
      expect(getPerc(100, 'QB', yahooPlayers, scadPlayers, scadLeague.franchiseTagDiscount, scadLeague.irReliefPerc)).toBe('9')
      expect(getPerc(250, 'QB', yahooPlayers, scadPlayers, scadLeague.franchiseTagDiscount, scadLeague.irReliefPerc)).toBe('4')
      expect(getPerc(221, 'QB', yahooPlayers, scadPlayers, scadLeague.franchiseTagDiscount, scadLeague.irReliefPerc)).toBe('4')
    })
    it('should return 0', () => {
      expect(getPositionSalaryTotal(100, 'QB', undefined, scadPlayers, scadLeague.franchiseTagDiscount, scadLeague.irReliefPerc)).toBe(0)
      expect(getPositionSalaryTotal(100, 'QB', undefined, undefined, scadLeague.franchiseTagDiscount, scadLeague.irReliefPerc)).toBe(0)
      expect(getPositionSalaryTotal(100, 'QB')).toBe(0)
      expect(getPositionSalaryTotal()).toBe(0)
      expect(getPositionSalaryTotal('')).toBe(0)
    })
  })
})
