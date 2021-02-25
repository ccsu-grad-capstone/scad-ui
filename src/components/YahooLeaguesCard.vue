<template lang="pug">
  q-card.q-pa-md
    .row.full-width(v-if="!loaded")
      .row.full-width.justify-center
        q-circular-progress.q-mt-xl(
          indeterminate
          size="90px"
          :thickness="0.2"
          color="primary"
          center-color="grey-5"
          track-color="transparent"
          class="q-ma-md"
          )
      .row.full-width.justify-center
        .text-grey Fetching SCAD team...
    q-item-section(v-else)
      q-card-section(horizontal)
        .col-3.text-h5.text-weight-bolder.q-pt-lg.gt-sm SCAD Leagues
        .col-3.text-weight-bolder.q-pt-lg.lt-md SCAD Leagues
        q-separator(vertical)
        .col
          .text-grey.q-pl-md Select row to change leagues
          q-separator
          q-list( v-for="(league, index) in scadLeagues" :key="index")
            q-item(clickable  @click.native="switchLeague(league._id, league.yahooLeagueId)")
              .row.full-width.q-pt-sm
                .col.text-body1.text-weight-bolder.gt-sm {{getLeagueName(league.yahooLeagueId)}}
                .col.lt-md {{getLeagueName(league.yahooLeagueId)}}
                .col.text-left.gt-sm
                  .row.full-width.q-gutter-md
                    .text-primary.text-weight-bold(v-if="(league._id == scadLeagueId)") Active League
                    .text-primary.text-weight-bold(v-else) Switch to League
                    .text-accent.text-weight-bold(v-if="league.isDefault") Default League
                    q-btn.q-px-xs(v-else label='Set as Default League' flat dense color='white' text-color='accent' size='sm' @click="setAsDefault(league._id)")
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
import { nodeHeader } from '../utilities/axios-node'
import { catchAxiosScadError } from '../utilities/catchAxiosErrors'
import { isCommishNotRegistered } from '../utilities/validators'
import { getScadLeague, getYahooLeague } from '../utilities/functions'
import notify from '../utilities/nofity'
import RegisterLeagueInvites from '../components/dialogs/registerLeagueInvites'

export default {
  name: 'YahooLeaguesCard',
  components: {
    'register-league-invites': RegisterLeagueInvites
  },

  data () {
    return {
      loaded: false,
      emailLeagueId: ''
    }
  },
  async mounted () {
    await this.$store.dispatch('league/getAllYahooCommishLeagues')
    this.loaded = true
  },
  computed: {
    user () {
      return this.$store.state.user
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
    async setAsDefault (id) {
      try {
        const response = await nodeHeader(
          this.tokens.access_token,
          this.tokens.id_token)
          .put(`/scad/league/default/update/${id}`)
        console.log('Update Default League Response: ', response)
        notify.updateDefaultLeague()
        await this.$store.dispatch('league/getAllScadLeagues')
      } catch (err) {
        catchAxiosScadError(err)
      }
    },
    async triggerDialog (yahooLeagueId) {
      this.emailLeagueId = yahooLeagueId
      await this.$store.commit('dialog/registerLeagueInvites')
    }
  }
}
</script>

<style lang="scss" scoped></style>
