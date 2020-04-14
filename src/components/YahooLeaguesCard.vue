<template lang="pug">
  div.q-pa-md.row.items-start.q-gutter-md
    q-card.q-pa-md.row(style='width: 100%')
      q-item-section
        div.text-body1
        q-separator
        q-card-section(horizontal)
          q-card-section.col-3.text-h6.text-weight-bolder.q-pt-md
            |  SCAD Leagues
          q-separator(vertical)
          q-card-section(style='width: 100%')
            q-list( separator v-for="(league, index) in scadLeagues" :key="index")
              q-item(clickable  @click.native="switchLeague(league.id, league.yahooLeagueId)")
                .row.full-width.q-pt-sm
                  .col.text-body1.text-weight-bolder
                    div
                      | {{getLeagueName(league.yahooLeagueId)}}
                  .col.text-left
                    .text-primary.text-weight-bold(v-if="!isActive(league.id)") Switch to League
                    .text-primary.text-weight-bold(v-else) Active League
        q-card-section(horizontal)
          q-card-section.col-3.text-h6.text-weight-bolder.q-pt-md
            |  Yahoo Leagues
          q-separator(vertical)
          q-card-section(style='width: 100%')
            q-list( separator v-for="(league, index) in yahooLeagues" :key="index")
              q-item(clickable  @click.native="yahooHome(league.league_id, league.url)")
                .row.full-width.q-pt-sm
                  .col.text-body1.text-weight-bolder
                    div
                      | {{league.name}}
                      q-badge.q-ml-sm(v-if="checkIfScadLeague(league.league_id)") SCAD
                  .col.text-left
                    .text-primary.text-weight-bold(v-if="isCommish(league.league_id)") Register League with SCAD

</template>
<script>
import { openURL } from 'quasar'

export default {
  name: 'YahooLeaguesCard',

  data () {
    return {
      loaded: false
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
    yahooHome (id, url) {
      if (this.isCommish(id)) {
        this.$router.push('register-league')
      } else {
        openURL(url)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
