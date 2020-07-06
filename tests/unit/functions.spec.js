import { getScadPlayer, getYahooPlayer, getLeagueRosterLimit } from '../../src/utilities/functions'
import { scadPlayers, yahooPlayers, yahooSettings } from '../data/testData.json'

describe('functions.js Test Suite', () => {
  describe('getScadPlayer tests', () => {
    it('should properly return', () => {
      let scadP = getScadPlayer(scadPlayers, 9265)
      expect(getScadPlayer(scadPlayers, 9265)).toBeDefined()
      expect(scadP.id).toBe(342)
      scadP = getScadPlayer(scadPlayers, 100030)
      expect(getScadPlayer(scadPlayers, 100030)).toBeDefined()
      expect(scadP.id).toBe(348)
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
      yahooP = getYahooPlayer(yahooPlayers, 100030)
      expect(yahooP).toBeDefined()
      expect(yahooP.name.full).toBe('Jacksonville')
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
})
