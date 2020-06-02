<template lang="pug">
  div.q-pa-md.row.items-start.q-gutter-md
    q-card.q-pa-md.row(style='width: 100%')
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
        div.text-body1
        q-separator
        q-card-section(horizontal)
          q-card-section.col-3.text-h6.text-weight-bolder.q-pt-md
            |  SCAD Leagues
          q-separator(vertical)
          q-card-section(style='width: 100%')
            .text-grey.q-pl-md Select row to change leagues
            q-separator
            q-list( v-for="(league, index) in scadLeagues" :key="index")
              q-item(clickable  @click.native="switchLeague(league.id, league.yahooLeagueId)")
                .row.full-width.q-pt-sm
                  .col.text-body1.text-weight-bolder
                    div
                      | {{getLeagueName(league.yahooLeagueId)}}
                  .col.text-left
                    .row.full-width.q-gutter-md
                      .text-primary.text-weight-bold(v-if="isActive(league.id)") Active League
                      .text-primary.text-weight-bold(v-else) Switch to League
                      .text-accent.text-weight-bold(v-if="league.isDefault") Default League
                      q-btn.q-px-xs(v-else label='Set as Default League' flat dense color='white' text-color='accent' size='sm' @click="setAsDefault(league.id)")
                  .col-1.text-right
                      q-btn.q-px-xs(icon='email' flat dense color='white' text-color='accent' size='sm' @click="triggerDialog(league.yahooLeagueId)")
              q-separator
        q-card-section(horizontal)
          q-card-section.col-3.text-h6.text-weight-bolder.q-pt-md
            |  Yahoo! Leagues
          q-separator(vertical)
          q-card-section(style='width: 100%')
            q-separator
            q-list( v-for="(league, index) in filterYahooLeagues()" :key="index")
              q-item(clickable  @click.native="yahooHome(league.league_id, league.url)")
                .row.full-width.q-pt-sm
                  .col.text-body1.text-weight-bolder
                    div
                      | {{league.name}}
                      q-badge.q-ml-sm(v-if="checkIfScadLeague(league.league_id)") SCAD
                  .col.text-left
                    .text-primary.text-weight-bold(v-if="isCommish(league.league_id)") Register League with SCAD
              q-separator
          q-dialog(v-model='registerLeagueInvites' persistent)
            register-league-invites(:emailLeagueId="emailLeagueId")

</template>
<script>
import { openURL } from 'quasar'
import { scad } from '../utilities/axios-scad'
import { catchAxiosScadError } from '../utilities/catchAxiosErrors'
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
      // eslint-disable-next-line eqeqeq
      let league = this.yahooLeagues.find(l => l.league_id == id)
      return league.name
    },
    scadOnClick (scadLeagueId, yahooLeaguedId) {

    },
    checkIfScadLeague (id) {
      // eslint-disable-next-line eqeqeq
      let league = this.scadLeagues.find(l => l.yahooLeagueId == id)
      if (league) {
        return true
      }
    },
    isActive (id) {
      if (id === this.scadLeagueId) {
        return true
      } else {
        return false
      }
    },
    isCommish (id) {
      let league = this.yahooCommishLeagues.find(l => l.league_id === id)
      // eslint-disable-next-line eqeqeq
      let registered = this.scadLeagues.find(l => l.yahooLeagueId == id)
      if (league && !registered) {
        return true
      } else {
        return false
      }
    },
    async switchLeague (scadLeagueId, yahooLeagueId) {
      if (!this.isActive(scadLeagueId)) {
        await this.$store.dispatch('league/switchLeagues', yahooLeagueId)
        this.$router.push('dashboard')
      }
    },
    filterYahooLeagues () {
      let leagues = []
      this.yahooLeagues.forEach(l => {
        leagues.push(l)
      })
      return leagues
    },
    yahooHome (id, url) {
      if (this.isCommish(id)) {
        this.$router.push('register-league')
      } else {
        openURL(url)
      }
    },
    async setAsDefault (id) {
      try {
        const response = await scad(
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
