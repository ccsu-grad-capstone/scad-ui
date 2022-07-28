<template lang="pug">
  q-card.q-pa-md
    loading(v-if="!loaded")
    q-item-section(v-else)
      q-card-section(horizontal)
        .col-3.text-h5.text-weight-bolder.q-pt-lg.gt-sm SCAD Leagues
        .col-3.text-weight-bolder.q-pt-lg.lt-md SCAD Leagues
        q-separator(vertical)
        .col
          .text-grey.q-pl-md Select row to change leagues
          q-separator
          q-list( v-for="(league, index) in user.defaultLeague.scadLeagues" :key="index")
            //- q-item(clickable  @click.native="switchLeague(league._id, league.yahooLeagueId)")
            q-item()
              .row.full-width.q-pt-sm
                .col.text-body1.text-weight-bolder.gt-sm {{getLeagueName(league.yahooLeagueId)}}
                .col.lt-md
                  | {{getLeagueName(league.yahooLeagueId)}}
                  .text-info.text-weight-bold(v-if="league.yahooLeagueId === user.defaultLeague.yahooLeagueId") Default League
                  q-btn.q-px-xs(v-else label='Set as Default League' flat dense color='white' text-color='accent' size='sm' @click="setAsDefault(league)")
                .col.text-left.gt-sm
                  .row.full-width.q-gutter-md
                    .text-primary.text-weight-bold(v-if="(league.scadLeagueId == scadLeagueId)") Active League
                    .text-primary.text-weight-bold(v-else) Switch to League
                    .text-info.text-weight-bold(v-if="league.yahooLeagueId === user.defaultLeague.yahooLeagueId") Default League
                    q-btn.q-px-xs(v-else label='Set as Default League' flat dense color='white' text-color='accent' size='sm' @click="setAsDefault(league)")
                .col-1.text-right.gt-sm
                    q-btn.q-px-xs(icon='email' flat dense color='white' text-color='accent' size='sm' @click="triggerDialog(league.yahooLeagueId)")
            q-separator
      q-card-section(horizontal)
        .col-3.text-h5.text-weight-bolder.q-pt-lg.gt-sm Yahoo! Leagues
        .col-3.text-weight-bolder.q-pt-lg.lt-md Yahoo! Leagues
        q-separator(vertical)
        .col
          q-separator
          q-list( v-for="(league, index) in yahooLeagues" :key="index")
            q-item(clickable  @click.native="yahooHome(league.league_id, league.url)")
              .row.full-width.q-pt-sm
                .col.text-body1.text-weight-bolder.gt-sm {{league.name}}
                .col.lt-sm {{league.name}}
                    q-badge.q-ml-sm(v-if="checkIfScadLeague(league.league_id)") SCAD
                .col.text-left.gt-sm
                  .text-primary.text-weight-bold(v-if="isCommishNotRegistered(league.league_id, yahooCommishLeagues, scadLeagues)") Register League with SCAD
            q-separator
        q-dialog(v-model='registerLeagueInvites' persistent)
          register-league-invites(:emailLeagueId="emailLeagueId")

</template>
<script>
import { openURL } from 'quasar'
import { isCommishNotRegistered } from '../utilities/validators'
import { getScadLeague, getYahooLeague } from '../utilities/functions'
import RegisterLeagueInvites from '../components/dialogs/registerLeagueInvites'
import Loading from '../components/Loading'

export default {
  name: 'YahooLeaguesCard',
  components: {
    'register-league-invites': RegisterLeagueInvites,
    'loading': Loading

  },

  data () {
    return {
      loaded: false,
      emailLeagueId: ''
    }
  },
  async mounted () {
    await this.getLeagues()
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
    },
    isCommishNotRegistered () {
      return isCommishNotRegistered
    },
    scadLeagueId () {
      return this.$store.state.league.scadLeagueId
    },
    scadLeagues () {
      return this.$store.state.league.scadLeagues
    },
    yahooLeagues () {
      return this.$store.state.league.yahooLeagues
    },
    yahooCommishLeagues () {
      return this.$store.state.league.yahooCommishLeagues
    },
    registerLeagueInvites () {
      return this.$store.state.dialog.registerLeagueInvites
    }
  },
  methods: {
    async getLeagues () {
      await this.$store.dispatch('league/getAllYahooLeagues')
      await this.$store.dispatch('league/getAllScadLeagues')
      this.loaded = true
    },
    getLeagueName (id) {
      return getYahooLeague(this.yahooLeagues, id).name
    },
    checkIfScadLeague (id) {
      if (getScadLeague(this.scadLeagues, id)) { return true } else { return false }
    },
    async switchLeague (scadLeagueId, yahooLeagueId) {
      if (scadLeagueId === this.scadLeagueId) {
        await this.$store.dispatch('league/switchLeagues', yahooLeagueId)
        this.$router.push('dashboard')
      }
    },
    yahooHome (id, url) {
      if (this.isCommishNotRegistered(id, this.yahooCommishLeagues, this.scadLeagues)) {
        this.$router.push('register-league')
      } else {
        openURL(url)
      }
    },
    async setAsDefault (league) {
      await this.$store.dispatch('user/setDefaultLeague', league)
    },
    async triggerDialog (yahooLeagueId) {
      this.emailLeagueId = yahooLeagueId
      await this.$store.commit('dialog/registerLeagueInvites')
    }
  }
}
</script>

<style lang="scss" scoped></style>
