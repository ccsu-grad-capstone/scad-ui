import { isIR, isCommishNotRegistered, checkPos } from '../../src/utilities/validators'
import { commissionerLeagues, scadLeagues, scadLeague, yahooPlayers } from '../data/testData.json'

describe('validators.js Test Suite', () => {
  describe('isIR tests', () => {
    it('should return true', () => {
      expect(isIR('IR')).toBeTruthy()
    })
    it('should return false', () => {
      expect(isIR('QB')).toBeFalsy()
      expect(isIR('RB')).toBeFalsy()
      expect(isIR('WR')).toBeFalsy()
      expect(isIR('TE')).toBeFalsy()
      expect(isIR('DEF')).toBeFalsy()
      expect(isIR('')).toBeFalsy()
      expect(isIR(undefined)).toBeFalsy()
      expect(isIR(null)).toBeFalsy()
    })
  })

  describe('isCommishNotRegistered tests', () => {
    it('should return true', () => {
      expect(isCommishNotRegistered(65939, commissionerLeagues, scadLeagues)).toBeTruthy()
    })
    it('should return false', () => {
      expect(isCommishNotRegistered(13088, commissionerLeagues, scadLeagues)).toBeFalsy()
      expect(isCommishNotRegistered(130, commissionerLeagues, scadLeagues)).toBeFalsy()
      expect(isCommishNotRegistered(undefined, commissionerLeagues, scadLeagues)).toBeFalsy()
      expect(isCommishNotRegistered(65939, undefined, scadLeagues)).toBeFalsy()
      expect(isCommishNotRegistered(65939, commissionerLeagues, undefined)).toBeFalsy()
      expect(isCommishNotRegistered(undefined)).toBeFalsy()
      expect(isCommishNotRegistered(undefined, '', null)).toBeFalsy()
    })
  })

  describe('checkPos tests', () => {
    it('should return true', () => {
      expect(checkPos('RB', scadLeague, yahooPlayers)).toBeTruthy()
      expect(checkPos('rb', scadLeague, yahooPlayers)).toBeTruthy()
    })
    it('should return false', () => {
      let settings = scadLeague
      settings.rbMax = 2
      expect(checkPos('RB', settings, yahooPlayers)).toBeFalsy()
      settings.rbMax = 10
      settings.rbMin = 10
      expect(checkPos('RB', settings, yahooPlayers)).toBeFalsy()
      expect(checkPos('', scadLeague, yahooPlayers)).toBeFalsy()
      expect(checkPos('RB', undefined, yahooPlayers)).toBeFalsy()
      expect(checkPos('rb', scadLeague, undefined)).toBeFalsy()
    })
  })
})
