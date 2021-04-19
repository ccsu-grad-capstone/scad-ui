<template lang="pug">
    q-card.q-ma-md
      q-card-section
        .text-h6.text-weight-bolder
          | Tokens
        .text-h6
          | tokens.access_token:
        .text-caption
          | {{tokens.access_token}}
        .text-h6
          | tokens.refresh_token:
        .text-caption
          |{{tokens.refresh_token}}
        .text-h6
          | tokens.id_token:
        .text-caption
          | {{tokens.id_token}}
      .col.q-pa-md.q-gutter-lg
            q-btn(label='Refresh Token' dense no-caps color='secondary' text-color='primary' size='md' @click="refreshToken")
      .col.q-pa-xs.q-gutter-lg
            q-btn(label='Test Lambda' dense no-caps color='orange' text-color='white' size='md' @click="testLambdas")
      .col.q-pa-xs.q-gutter-lg
            q-btn(label='getMyTeams' dense no-caps color='orange' text-color='white' size='md' @click="getMyTeams")
      .col.q-pa-xs.q-gutter-lg
            q-btn(label='getMyTeam' dense no-caps color='orange' text-color='white' size='md' @click="getMyTeam")
      .col.q-pa-xs.q-gutter-lg
            q-btn(label='getTeamWithRoster' dense no-caps color='orange' text-color='white' size='md' @click="getTeamWithRoster")
      .col.q-pa-xs.q-gutter-lg
            q-btn(label='getLeagueMeta' dense no-caps color='orange' text-color='white' size='md' @click="getLeagueMeta")
      .col.q-pa-xs.q-gutter-lg
            q-btn(label='getLeagueSettings' dense no-caps color='orange' text-color='white' size='md' @click="getLeagueSettings")
      .col.q-pa-xs.q-gutter-lg
            q-btn(label='getLeagueStandings' dense no-caps color='orange' text-color='white' size='md' @click="getLeagueStandings")
      .col.q-pa-xs.q-gutter-lg
            q-btn(label='getLeagueTeams' dense no-caps color='orange' text-color='white' size='md' @click="getLeagueTeams")
      .col.q-pa-xs.q-gutter-lg
            q-btn(label='getLeagueTransactions' dense no-caps color='orange' text-color='white' size='md' @click="getLeagueTransactions")
      .col.q-pa-xs.q-gutter-lg
            q-btn(label='getUserLeaguesByCurrentSeason' dense no-caps color='orange' text-color='white' size='md' @click="getUserLeaguesByCurrentSeason")
      .col.q-pa-xs.q-gutter-lg
            q-btn(label='getAllCommishLeagues' dense no-caps color='orange' text-color='white' size='md' @click="getAllCommishLeagues")
      .col.q-pa-xs.q-gutter-lg
            q-btn(label='getAllLeaguePlayers' dense no-caps color='orange' text-color='white' size='md' @click="getAllLeaguePlayers")
      .col.q-pa-xs.q-gutter-lg
            q-btn(label='getGames' dense no-caps color='orange' text-color='white' size='md' @click="getGames")
      .col.q-pa-md.q-gutter-lg
            q-btn(label='Test Yahoo API' dense no-caps color='orange' text-color='white' size='md' @click="testAPIwithYahooEndpoints")
</template>

<script>
/* eslint-disable no-unused-vars */

import { aws, awsHeader, node, nodeHeader } from '../utilities/axios-node'
import { catchAxiosNodeError } from '../utilities/catchAxiosErrors'
import axios from 'axios'
export default {
  name: 'MyTokens',
  data () {
    return {}
  },
  mounted () {
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    league () {
      return this.$store.state.league
    },
    tokens () {
      return this.user.tokens
    }
  },
  methods: {
    async refreshToken () {
      console.log('[DASHBOARD] - refreshToken()')
      await this.$store.dispatch('user/refreshToken')
    },
    async testAPIwithYahooEndpoints () {
      try {
      // TESTING API..
        const getDashboard = await nodeHeader(this.user.tokens.access_token).get(`/scad/dashboard/details`)
        console.log('API YAHOO TEST getDashboard: ', getDashboard.data)

        const getMyTeams = await nodeHeader(this.user.tokens.access_token).get(`/yahoo/myTeams`)
        console.log('API YAHOO TEST getMyTeams: ', getMyTeams.data)

        const getMyTeam = await nodeHeader(this.user.tokens.access_token).get(`/yahoo/game/this.league.yahooGameKey/league/13088/myTeam`)
        console.log('API YAHOO TEST getMyTeam: ', getMyTeam.data)

        const getLeagueMeta = await nodeHeader(this.user.tokens.access_token).get(`/yahoo/game/this.league.yahooGameKey/league/13088`)
        console.log('API YAHOO TEST getLeagueMeta: ', getLeagueMeta.data)

        const getLeagueSettings = await nodeHeader(this.user.tokens.access_token).get(`/yahoo/game/this.league.yahooGameKey/league/13088/settings`)
        console.log('API YAHOO TEST getLeagueSettings: ', getLeagueSettings.data)

        const getLeagueStandings = await nodeHeader(this.user.tokens.access_token).get(`/yahoo/game/this.league.yahooGameKey/league/13088/standings`)
        console.log('API YAHOO TEST getLeagueStandings: ', getLeagueStandings.data)

        const getLeagueTeams = await nodeHeader(this.user.tokens.access_token).get(`/yahoo/game/this.league.yahooGameKey/league/13088/teams`)
        console.log('API YAHOO TEST getLeagueTeams: ', getLeagueTeams.data)

        const getAllUsersLeagues = await nodeHeader(this.user.tokens.access_token).get(`/yahoo/game/this.league.yahooGameKey/league/get/all`)
        console.log('API YAHOO TEST getAllUsersLeagues: ', getAllUsersLeagues.data)

        const getLeagueTransactions = await nodeHeader(this.user.tokens.access_token).get(`/yahoo/game/this.league.yahooGameKey/league/13088/transactions`)
        console.log('API YAHOO TEST getLeagueTransactions: ', getLeagueTransactions.data)

        const getTeamWithRoster = await nodeHeader(this.user.tokens.access_token).get(`/yahoo/game/this.league.yahooGameKey/league/13088/team/2/roster`)
        console.log('API YAHOO TEST getTeamWithRoster: ', getTeamWithRoster.data)

        const getGames = await nodeHeader(this.user.tokens.access_token).get(`/yahoo/game`)
        console.log('API YAHOO TEST getGames: ', getGames.data)

        const getAllCommishLeagues = await nodeHeader(this.user.tokens.access_token).get(`/yahoo/game/this.league.yahooGameKey/league/commissioner/all`)
        console.log('API YAHOO TEST getAllCommishLeagues: ', getAllCommishLeagues.data)

        const getAllLeaguePlayers = await nodeHeader(this.user.tokens.access_token).get(`/yahoo/game/this.league.yahooGameKey/league/13088/players`)
        console.log('API YAHOO TEST getAllLeaguePlayers: ', getAllLeaguePlayers.data)
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },

    async getMyTeams () {
      try {
        const getMyTeams = await awsHeader(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/myTeams`)
        console.log('LAMBDA TEST getMyTeams:', getMyTeams)
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },

    async getMyTeam () {
      const getMyTeam = await awsHeader(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/this.league.yahooGameKey/league/13088/myTeam`)
      console.log('LAMBDA TEST getMyTeam:', getMyTeam)
    },

    async getTeamWithRoster () {
      const getTeamWithRoster = await awsHeader(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/this.league.yahooGameKey/league/13088/team/2/roster`)
      console.log('LAMBDA TEST getTeamWithRoster:', getTeamWithRoster)
    },

    async getLeagueMeta () {
      const getLeagueMeta = await awsHeader(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/this.league.yahooGameKey/league/13088`)
      console.log('LAMBDA TEST getLeagueMeta:', getLeagueMeta)
    },

    async getLeagueSettings () {
      const getLeagueSettings = await awsHeader(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/this.league.yahooGameKey/league/13088/settings`)
      console.log('LAMBDA TEST getLeagueSettings:', getLeagueSettings)
    },

    async getLeagueStandings () {
      const getLeagueStandings = await awsHeader(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/this.league.yahooGameKey/league/13088/standings`)
      console.log('LAMBDA TEST getLeagueStandings:', getLeagueStandings)
    },

    async getLeagueTeams () {
      const getLeagueTeams = await awsHeader(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/this.league.yahooGameKey/league/13088/teams`)
      console.log('LAMBDA TEST getLeagueTeams:', getLeagueTeams)
    },

    async getLeagueTransactions () {
      const getLeagueTransactions = await awsHeader(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/this.league.yahooGameKey/league/13088/transactions`)
      console.log('LAMBDA TEST getLeagueTransactions:', getLeagueTransactions)
    },

    async getUserLeaguesByCurrentSeason () {
      const getUserLeaguesByCurrentSeason = await awsHeader(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/this.league.yahooGameKey/league/get/all`)
      console.log('LAMBDA TEST getUserLeaguesByCurrentSeason:', getUserLeaguesByCurrentSeason)
    },

    async getAllCommishLeagues () {
      const getAllCommishLeagues = await awsHeader(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/this.league.yahooGameKey/league/commissioner/all`)
      console.log('LAMBDA TEST getAllCommishLeagues:', getAllCommishLeagues)
    },

    async getAllLeaguePlayers () {
      const getAllLeaguePlayers = await awsHeader(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/this.league.yahooGameKey/league/13088/players`)
      console.log('LAMBDA TEST getAllLeaguePlayers:', getAllLeaguePlayers)
    },

    async getGames () {
      const getGames = await awsHeader(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game`)
      console.log('LAMBDA TEST getGames:', getGames)
    },

    async testLambdas () {
      this.loaded = true
      try {
        await this.getMyTeams()
        await this.getMyTeam()
        await this.getTeamWithRoster()
        await this.getLeagueMeta()
        await this.getLeagueSettings()
        await this.getLeagueStandings()
        await this.getLeagueTeams()
        await this.getLeagueTransactions()
        await this.getUserLeaguesByCurrentSeason()
        await this.getAllCommishLeagues()
        await this.getAllLeaguePlayers()
        await this.getGames()
      } catch (error) {
        catchAxiosNodeError(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
