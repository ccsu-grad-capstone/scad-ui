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

      //- DRAFT PICKS
      .col.q-pa-xs.q-gutter-lg
            q-btn(label='getDraftPick' dense no-caps color='orange' text-color='white' size='md' @click="getDraftPick")
      .col.q-pa-xs.q-gutter-lg
            q-btn(label='createDraftPick' dense no-caps color='orange' text-color='white' size='md' @click="createDraftPick")
      .col.q-pa-xs.q-gutter-lg
            q-btn(label='updateDraftPick' dense no-caps color='orange' text-color='white' size='md' @click="updateDraftPick")
      .col.q-pa-xs.q-gutter-lg
            q-btn(label='deleteDraftPick' dense no-caps color='orange' text-color='white' size='md' @click="deleteDraftPick")
      .col.q-pa-xs.q-gutter-lg
            q-btn(label='checkDraftPick' dense no-caps color='orange' text-color='white' size='md' @click="checkDraftPick")
      .col.q-pa-xs.q-gutter-lg
            q-btn(label='getAllDraftPicksByLeague' dense no-caps color='orange' text-color='white' size='md' @click="getAllDraftPicksByLeague")
      .col.q-pa-xs.q-gutter-lg
            q-btn(label='getAllDraftPicksByTeam' dense no-caps color='orange' text-color='white' size='md' @click="getAllDraftPicksByTeam")

      //- YAHOO
      //- .col.q-pa-xs.q-gutter-lg
      //-       q-btn(label='Test Lambda - Yahoo' dense no-caps color='orange' text-color='white' size='md' @click="testLambdas")
      .col.q-pa-xs.q-gutter-lg
            q-btn(label='getMyLeagues' dense no-caps color='orange' text-color='white' size='md' @click="getMyYahooLeagues")
      //- .col.q-pa-xs.q-gutter-lg
      //-       q-btn(label='getMyTeam' dense no-caps color='orange' text-color='white' size='md' @click="getMyTeam")
      //- .col.q-pa-xs.q-gutter-lg
      //-       q-btn(label='getTeamWithRoster' dense no-caps color='orange' text-color='white' size='md' @click="getTeamWithRoster")
      //- .col.q-pa-xs.q-gutter-lg
      //-       q-btn(label='getLeagueMeta' dense no-caps color='orange' text-color='white' size='md' @click="getLeagueMeta")
      //- .col.q-pa-xs.q-gutter-lg
      //-       q-btn(label='getLeagueSettings' dense no-caps color='orange' text-color='white' size='md' @click="getLeagueSettings")
      //- .col.q-pa-xs.q-gutter-lg
      //-       q-btn(label='getLeagueStandings' dense no-caps color='orange' text-color='white' size='md' @click="getLeagueStandings")
      //- .col.q-pa-xs.q-gutter-lg
      //-       q-btn(label='getLeagueTeams' dense no-caps color='orange' text-color='white' size='md' @click="getLeagueTeams")
      //- .col.q-pa-xs.q-gutter-lg
      //-       q-btn(label='getLeagueTransactions' dense no-caps color='orange' text-color='white' size='md' @click="getLeagueTransactions")
      //- .col.q-pa-xs.q-gutter-lg
      //-       q-btn(label='getUserLeaguesByCurrentSeason' dense no-caps color='orange' text-color='white' size='md' @click="getUserLeaguesByCurrentSeason")
      //- .col.q-pa-xs.q-gutter-lg
      //-       q-btn(label='getAllCommishLeagues' dense no-caps color='orange' text-color='white' size='md' @click="getAllCommishLeagues")
      //- .col.q-pa-xs.q-gutter-lg
      //-       q-btn(label='getAllLeaguePlayers' dense no-caps color='orange' text-color='white' size='md' @click="getAllLeaguePlayers")
      //- .col.q-pa-xs.q-gutter-lg
      //-       q-btn(label='getGames' dense no-caps color='orange' text-color='white' size='md' @click="getGames")
      //- .col.q-pa-md.q-gutter-lg
      //-       q-btn(label='Test Yahoo API - NODE service' dense no-caps color='orange' text-color='white' size='md' @click="testAPIwithYahooEndpoints")
</template>

<script>
/* eslint-disable no-unused-vars */

import { aws, api, node, nodeHeader } from '../utilities/axios-node'
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
        const getDashboard = await nodeHeader(this.user.tokens.access_token, this.user.tokens.id_token).get(`/scad/dashboard/details`)
        console.log('API YAHOO TEST getDashboard: ', getDashboard.data)

        // const getMyTeams = await nodeHeader(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/${this.league.yahooGameKey}/myTeams`)
        // console.log('API YAHOO TEST getMyTeams: ', getMyTeams.data)

        const getMyTeam = await nodeHeader(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/${this.league.yahooGameKey}/league/${this.league.yahooLeagueId}/myTeam`)
        console.log('API YAHOO TEST getMyTeam: ', getMyTeam.data)

        const getLeagueMeta = await nodeHeader(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/${this.league.yahooGameKey}/league/${this.league.yahooLeagueId}`)
        console.log('API YAHOO TEST getLeagueMeta: ', getLeagueMeta.data)

        const getLeagueSettings = await nodeHeader(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/${this.league.yahooGameKey}/league/${this.league.yahooLeagueId}/settings`)
        console.log('API YAHOO TEST getLeagueSettings: ', getLeagueSettings.data)

        const getLeagueStandings = await nodeHeader(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/${this.league.yahooGameKey}/league/${this.league.yahooLeagueId}/standings`)
        console.log('API YAHOO TEST getLeagueStandings: ', getLeagueStandings.data)

        const getLeagueTeams = await nodeHeader(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/${this.league.yahooGameKey}/league/${this.league.yahooLeagueId}/teams`)
        console.log('API YAHOO TEST getLeagueTeams: ', getLeagueTeams.data)

        const getAllUsersLeagues = await nodeHeader(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/${this.league.yahooGameKey}/league/get/all`)
        console.log('API YAHOO TEST getAllUsersLeagues: ', getAllUsersLeagues.data)

        const getLeagueTransactions = await nodeHeader(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/${this.league.yahooGameKey}/league/${this.league.yahooLeagueId}/transactions`)
        console.log('API YAHOO TEST getLeagueTransactions: ', getLeagueTransactions.data)

        const getTeamWithRoster = await nodeHeader(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/${this.league.yahooGameKey}/league/${this.league.yahooLeagueId}/team/2/roster`)
        console.log('API YAHOO TEST getTeamWithRoster: ', getTeamWithRoster.data)

        const getGames = await nodeHeader(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game`)
        console.log('API YAHOO TEST getGames: ', getGames.data)

        const getAllCommishLeagues = await nodeHeader(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/${this.league.yahooGameKey}/league/commissioner/all`)
        console.log('API YAHOO TEST getAllCommishLeagues: ', getAllCommishLeagues.data)

        const getAllLeaguePlayers = await nodeHeader(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/${this.league.yahooGameKey}/league/${this.league.yahooLeagueId}/players`)
        console.log('API YAHOO TEST getAllLeaguePlayers: ', getAllLeaguePlayers.data)
      } catch (error) {
        catchAxiosNodeError(error)
      }
    },

    // LAMBDAS

    // DRAFT PICKS
    async getDraftPick () {
      try {
        const getDraftPick = await api(this.user.tokens.access_token, this.user.tokens.id_token).get(`/draftPicks/611c08fab0bf94e85c16f0af`)
        console.log('LAMBDA TEST getDraftPick:', getDraftPick.data)
      } catch (error) {
        console.log(error.message)
      }
    },
    async createDraftPick () {
      const createDraftPick = await api(this.user.tokens.access_token, this.user.tokens.id_token).post(`/draftPicks/create`, { 'data': { 'name': 'avery lauzon' } })
      console.log('LAMBDA TEST createDraftPick:', createDraftPick.data)
    },
    async deleteDraftPick () {
      const deleteDraftPick = await api(this.user.tokens.access_token, this.user.tokens.id_token).delete(`/draftPicks/611c08fbb0bf94e85c16f0d3`)
      console.log('LAMBDA TEST deleteDraftPick:', deleteDraftPick.data)
    },
    async updateDraftPick () {
      const updateDraftPick = await api(this.user.tokens.access_token, this.user.tokens.id_token).patch(`/draftPicks/611c08fab0bf94e85c16f0af`, { 'data': { comments: 'test' } })
      console.log('LAMBDA TEST updateDraftPick:', updateDraftPick.data)
    },
    async checkDraftPick () {
      const checkDraftPick = await api(this.user.tokens.access_token, this.user.tokens.id_token).get(`/draftPicks/check/${this.league.scadLeagueId}`)
      console.log('LAMBDA TEST checkDraftPick:', checkDraftPick.data)
    },
    async getAllDraftPicksByLeague () {
      const getAllDraftPicksByLeague = await api(this.user.tokens.access_token, this.user.tokens.id_token).get(`/draftPicks/${this.league.scadLeagueId}/${this.league.scadSettings.seasonYear}`)
      console.log('LAMBDA TEST getAllDraftPicksByLeague:', getAllDraftPicksByLeague.data)
    },
    async getAllDraftPicksByTeam () {
      const getAllDraftPicksByTeam = await api(this.user.tokens.access_token, this.user.tokens.id_token).get(`/draftPicks/${this.league.scadLeagueId}/${this.league.scadSettings.seasonYear}/${this.user.user.guid}`)
      console.log('LAMBDA TEST getAllDraftPicksByTeam:', getAllDraftPicksByTeam.data)
    },

    // YAHOO
    async getMyYahooLeagues () {
      const getMyLeagues = await api(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/${this.league.yahooGameKey}/league/get/all`)
      console.log('LAMBDA TEST getMyLeagues:', getMyLeagues.data)
    },
    async getMyTeam () {
      const getMyTeam = await api(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/${this.league.yahooGameKey}/league/${this.league.yahooLeagueId}/myTeam`)
      console.log('LAMBDA TEST getMyTeam:', getMyTeam)
    },

    async getTeamWithRoster () {
      const getTeamWithRoster = await api(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/${this.league.yahooGameKey}/league/${this.league.yahooLeagueId}/team/2/roster`)
      console.log('LAMBDA TEST getTeamWithRoster:', getTeamWithRoster)
    },

    async getLeagueMeta () {
      const getLeagueMeta = await api(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/${this.league.yahooGameKey}/league/${this.league.yahooLeagueId}`)
      console.log('LAMBDA TEST getLeagueMeta:', getLeagueMeta)
    },

    async getLeagueSettings () {
      const getLeagueSettings = await api(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/${this.league.yahooGameKey}/league/${this.league.yahooLeagueId}/settings`)
      console.log('LAMBDA TEST getLeagueSettings:', getLeagueSettings)
    },

    async getLeagueStandings () {
      const getLeagueStandings = await api(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/${this.league.yahooGameKey}/league/${this.league.yahooLeagueId}/standings`)
      console.log('LAMBDA TEST getLeagueStandings:', getLeagueStandings)
    },

    async getLeagueTeams () {
      const getLeagueTeams = await api(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/${this.league.yahooGameKey}/league/${this.league.yahooLeagueId}/teams`)
      console.log('LAMBDA TEST getLeagueTeams:', getLeagueTeams)
    },

    async getLeagueTransactions () {
      const getLeagueTransactions = await api(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/${this.league.yahooGameKey}/league/${this.league.yahooLeagueId}/transactions`)
      console.log('LAMBDA TEST getLeagueTransactions:', getLeagueTransactions)
    },

    async getUserLeaguesByCurrentSeason () {
      const getUserLeaguesByCurrentSeason = await api(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/${this.league.yahooGameKey}/league/get/all`)
      console.log('LAMBDA TEST getUserLeaguesByCurrentSeason:', getUserLeaguesByCurrentSeason)
    },

    async getAllCommishLeagues () {
      const getAllCommishLeagues = await api(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/${this.league.yahooGameKey}/league/commissioner/all`)
      console.log('LAMBDA TEST getAllCommishLeagues:', getAllCommishLeagues)
    },

    async getAllLeaguePlayers () {
      const getAllLeaguePlayers = await api(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game/${this.league.yahooGameKey}/league/${this.league.yahooLeagueId}/players`)
      console.log('LAMBDA TEST getAllLeaguePlayers:', getAllLeaguePlayers)
    },

    async getGames () {
      const getGames = await api(this.user.tokens.access_token, this.user.tokens.id_token).get(`/yahoo/game`)
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
