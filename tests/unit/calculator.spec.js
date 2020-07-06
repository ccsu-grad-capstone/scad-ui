import { calcTeamSalary, calcPlayerSalary, calcFranchiseTagSalary, calcIrSalary, getPosCount, getPlayerCount, getPositionSalaryTotal, getPerc } from '../../src/utilities/calculator'
import { scadPlayers, yahooPlayers, scadLeague, yahooSettings } from '../data/testData.json'

describe('calculator.js Test Suite', () => {
  describe('calcTeamSalary tests', () => {
    it('should properly return salary', () => {
    })
  })

  describe('calcPlayerSalary tests', () => {
    it('should properly return salary', () => {
      expect(calcPlayerSalary(27540, 'RB', scadPlayers, 25, 50)).toBe(23)
      expect(calcPlayerSalary(27540, 'IR', scadPlayers, 25, 50)).toBe(12)
      expect(calcPlayerSalary(31379, 'RB', scadPlayers, 25, 50)).toBe(19)
      expect(calcPlayerSalary(31379, 'WR', scadPlayers, 25, 50)).toBe(19)
      expect(calcPlayerSalary(31379, 'IR', scadPlayers, 25, 50)).toBe(10)
      expect(calcPlayerSalary(31379, 'IR', scadPlayers, 25, 40)).toBe(11)
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
      expect(getPosCount('QB', yahooPlayers)).toBe(2)
      expect(getPosCount('def', yahooPlayers)).toBe(3)
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
      expect(getPlayerCount(yahooPlayers)).toBe(23)
    })
    it('should properly return 0', () => {
      expect(getPlayerCount(undefined)).toBe(0)
    })
  })

  describe('getPositionSalaryTotal tests', () => {
    it('should properly return proper dollar amount', () => {
      expect(getPositionSalaryTotal('QB', yahooPlayers, scadPlayers, scadLeague.franchiseTagDiscount, scadLeague.irReliefPerc)).toBe(25)
      expect(getPositionSalaryTotal('QB', yahooPlayers, scadPlayers, scadLeague.franchiseTagDiscount, 0)).toBe(31)
      expect(getPositionSalaryTotal('qb', yahooPlayers, scadPlayers, scadLeague.franchiseTagDiscount, scadLeague.irReliefPerc)).toBe(25)
      expect(getPositionSalaryTotal('TE', yahooPlayers, scadPlayers, scadLeague.franchiseTagDiscount, scadLeague.irReliefPerc)).toBe(23)
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
      expect(getPerc(100, 'QB', yahooPlayers, scadPlayers, scadLeague.franchiseTagDiscount, scadLeague.irReliefPerc)).toBe('25')
      expect(getPerc(250, 'QB', yahooPlayers, scadPlayers, scadLeague.franchiseTagDiscount, scadLeague.irReliefPerc)).toBe('10')
      expect(getPerc(221, 'QB', yahooPlayers, scadPlayers, scadLeague.franchiseTagDiscount, scadLeague.irReliefPerc)).toBe('11')
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
