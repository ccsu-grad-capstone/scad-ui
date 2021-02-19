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
            q-btn(label='Test Lambda' dense no-caps color='orange' text-color='white' size='md' @click="testLambdas")
            q-btn(label='Test API' dense no-caps color='orange' text-color='white' size='md' @click="testAPIwithYahooEndpoints")
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
        const getMyTeams = await nodeHeader(this.user.tokens.access_token).get(`/yahoo/myTeams`)
        console.log('API YAHOO TEST getMyTeams: ', getMyTeams.data)

        const getMyTeam = await nodeHeader(this.user.tokens.access_token).get(`/yahoo/league/13088/myTeam`)
        console.log('API YAHOO TEST getMyTeam: ', getMyTeam.data)

        const getLeagueMeta = await nodeHeader(this.user.tokens.access_token).get(`/yahoo/league/13088`)
        console.log('API YAHOO TEST getLeagueMeta: ', getLeagueMeta.data)

        const getLeagueSettings = await nodeHeader(this.user.tokens.access_token).get(`/yahoo/league/13088/settings`)
        console.log('API YAHOO TEST getLeagueSettings: ', getLeagueSettings.data)

        const getLeagueStandings = await nodeHeader(this.user.tokens.access_token).get(`/yahoo/league/13088/standings`)
        console.log('API YAHOO TEST getLeagueStandings: ', getLeagueStandings.data)

        const getLeagueTeams = await nodeHeader(this.user.tokens.access_token).get(`/yahoo/league/13088/teams`)
        console.log('API YAHOO TEST getLeagueTeams: ', getLeagueTeams.data)

        const getAllUsersLeagues = await nodeHeader(this.user.tokens.access_token).get(`/yahoo/league/team/all`)
        console.log('API YAHOO TEST getAllUsersLeagues: ', getAllUsersLeagues.data)

        const getLeagueTransactions = await nodeHeader(this.user.tokens.access_token).get(`/yahoo/league/13088/transactions`)
        console.log('API YAHOO TEST getLeagueTransactions: ', getLeagueTransactions.data)

        const getTeamWithRoster = await nodeHeader(this.user.tokens.access_token).get(`/yahoo/league/13088/team/2/roster`)
        console.log('API YAHOO TEST getTeamWithRoster: ', getTeamWithRoster.data)

        const getGames = await nodeHeader(this.user.tokens.access_token).get(`/yahoo/game`)
        console.log('API YAHOO TEST getGames: ', getGames.data)

        const getAllCommishLeagues = await nodeHeader(this.user.tokens.access_token).get(`/yahoo/league/commissioner/all`)
        console.log('API YAHOO TEST getAllCommishLeagues: ', getAllCommishLeagues.data)

        const getAllLeaguePlayers = await nodeHeader(this.user.tokens.access_token).get(`/yahoo/league/13088/players`)
        console.log('API YAHOO TEST getAllLeaguePlayers: ', getAllLeaguePlayers.data)
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },

    async testLambdas () {
      this.loaded = true
      try {
        const getMyTeams = await awsHeader(this.user.tokens.access_token).get(`/yahoo/myTeams`)
        console.log('LAMBDA TEST getMyTeams:', getMyTeams)

        const getMyTeam = await awsHeader(this.user.tokens.access_token).get(`/yahoo/league/13088/myTeam`)
        console.log('LAMBDA TEST getMyTeam:', getMyTeam)

        const getLeagueMeta = await awsHeader(this.user.tokens.access_token).get(`/yahoo/league/13088`)
        console.log('LAMBDA TEST getLeagueMeta:', getLeagueMeta)

        const getLeagueSettings = await awsHeader(this.user.tokens.access_token).get(`/yahoo/league/13088/settings`)
        console.log('LAMBDA TEST getLeagueSettings:', getLeagueSettings)

        const getLeagueStandings = await awsHeader(this.user.tokens.access_token).get(`/yahoo/league/13088/standings`)
        console.log('LAMBDA TEST getLeagueStandings:', getLeagueStandings)

        const getLeagueTeams = await awsHeader(this.user.tokens.access_token).get(`/yahoo/league/13088/teams`)
        console.log('LAMBDA TEST getLeagueTeams:', getLeagueTeams)

        const getAllUsersLeagues = await awsHeader(this.user.tokens.access_token).get(`/yahoo/league/all`)
        console.log('LAMBDA TEST getAllUsersLeagues:', getAllUsersLeagues)

        const getLeagueTransactions = await awsHeader(this.user.tokens.access_token).get(`/yahoo/league/13088/transactions`)
        console.log('LAMBDA TEST getLeagueTransactions:', getLeagueTransactions)

        const getRoster = await awsHeader(this.user.tokens.access_token).get(`/yahoo/league/13088/team/2/roster`)
        console.log('LAMBDA TEST getRoster:', getRoster)
      } catch (error) {
        catchAxiosNodeError(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
