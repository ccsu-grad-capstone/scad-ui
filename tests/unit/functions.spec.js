import { getScadPlayer, getYahooPlayer, getLeagueRosterLimit, isFranchiseTagged } from '../../src/utilities/functions'
import { scadPlayers, yahooPlayers, yahooSettings } from '../data/testData.json'

describe('functions.js Test Suite', () => {
  describe('getScadPlayer tests', () => {
    it('should properly return', () => {
      let scadP = getScadPlayer(scadPlayers, 9265)
      expect(getScadPlayer(scadPlayers, 9265)).toBeDefined()
      expect(scadP._id).toBe('603fdd2f9742d6ad14d606d7')
      scadP = getScadPlayer(scadPlayers, 30977)
      expect(getScadPlayer(scadPlayers, 30977)).toBeDefined()
      expect(scadP._id).toBe('603fdd2e9742d6ad14d606ca')
    })
    it('should properly return undefined', () => {
      expect(getScadPlayer(scadPlayers, 232)).toBeUndefined()
      expect(getScadPlayer(scadPlayers)).toBeUndefined()
      expect(getScadPlayer(undefined, 232)).toBeUndefined()
      expect(getScadPlayer()).toBeUndefined()
      expect(getScadPlayer(yahooPlayers, 9265)).toBeUndefined()
    })
  })

  describe('getYahooPlayer tests', () => {
    it('should return true', () => {
      let yahooP = getYahooPlayer(yahooPlayers, 9265)
      expect(yahooP).toBeDefined()
      expect(yahooP.name.full).toBe('Matthew Stafford')
      yahooP = getYahooPlayer(yahooPlayers, 30977)
      expect(yahooP).toBeDefined()
      expect(yahooP.name.full).toBe('Josh Allen')
    })
    it('should properly return undefined', () => {
      expect(getYahooPlayer(yahooPlayers, 232)).toBeUndefined()
      expect(getYahooPlayer(yahooPlayers)).toBeUndefined()
      expect(getYahooPlayer(undefined, 232)).toBeUndefined()
      expect(getYahooPlayer()).toBeUndefined()
      expect(getYahooPlayer(scadPlayers, 9265)).toBeUndefined()
    })
  })

  describe('getLeagueRosterLimit tests', () => {
    it('should return true', () => {
      expect(getLeagueRosterLimit(yahooSettings.roster_positions)).toBe(24)
    })
    it('should properly return undefined', () => {
      expect(getLeagueRosterLimit()).toBeUndefined()
      expect(getLeagueRosterLimit(yahooSettings)).toBeUndefined()
    })
  })

  describe('isFranchiseTagged tests', () => {
    let scadTeam = {
      roster: scadPlayers
    }
    it('should return true', () => {
      expect(isFranchiseTagged('27540', scadTeam)).toBeFalsy()
    })
    it('should return true', () => {
      expect(isFranchiseTagged('9265', scadTeam)).toBeTruthy()
    })
    it('should return true', () => {
      expect(isFranchiseTagged('65', scadTeam)).toBeFalsy()
    })
  })
})
