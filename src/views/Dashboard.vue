<template lang="pug">
  q-page(v-if="loaded")
    .row.full-width(v-if="refresh")
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
        .text-grey Updating SCAD with lastest Yahoo! updates
      .row.full-width.justify-center
        .text-primary This may take a moment
    .row.q-gutter-md.full-width.justify-center.q-pt-lg(v-if="league.isActive && !refresh")
      .row
        .div.mobile-hide
          q-avatar(size="75px")
            img(src="../statics/yahoo-ff.png")
        .column.justify-center.align-center.text-center
          .text-h4.text-weight-bolder {{league.yahooLeagueDetails.name}}
          a(:href='league.yahooLeagueDetails.url') {{league.yahooLeagueDetails.url}}
      .row.full-width.justify-center
        .col-xl-7.col-lg-7.col-md-7.col-sm-10.col-xs-10
          lite-league.gt-xs(@updateTeamSalaries="updateTeamSalaries")
          lite-league-mobile.lt-sm(@updateTeamSalaries="updateTeamSalaries")
          transactions
        .col-xl-4.col-lg-4.col-md-4.col-sm-10.col-xs-10
          lite-my-team
      .row.full-width.justify-center(v-if="commish()")
        .col-10
          league-diagnostics

</template>

<script>
import LiteMyTeam from '../components/LiteMyTeam'
import LiteLeague from '../components/LiteLeague'
import LeagueDiagnostics from '../components/LeagueDiagnostics'
import Transactions from '../components/Transactions'
import LiteLeagueMobile from '../components/LiteLeagueMobile'
import LiteDraftPicks from '../components/LiteDraftPicks'

export default {
  name: 'Dashboard',
  components: {
    'lite-my-team': LiteMyTeam,
    'lite-league': LiteLeague,
    'league-diagnostics': LeagueDiagnostics,
    'transactions': Transactions,
    'lite-league-mobile': LiteLeagueMobile,
    'lite-draft-picks': LiteDraftPicks
  },
  data () {
    return {
      loaded: false,
      refresh: false
    }
  },
  async created () {
    // await this.$store.dispatch('league/getScadInfo')
    if (!this.league.isActive) {
      this.$router.push('/about')
    } else {
      this.loaded = true
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    loggedIn () {
      return this.user.active
    },
    tokens () {
      return this.user.tokens
    },
    league () {
      return this.$store.state.league
    },
    scadLeagues () {
      return this.league.scadLeagues
    },
    scadLeagueId () {
      return this.league.scadLeagueId
    },
    transactionsLoaded () { return this.$store.state.transactions.loaded }
  },
  methods: {
    async updateTeamSalaries () {
      this.refresh = true
      await this.$store.dispatch('league/updateTeamSalaries')
      this.refresh = false
    },
    commish () {
      // eslint-disable-next-line eqeqeq
      console.log(this.user.user.sub)
      if (this.user.user.sub === '2OMLCT3C2A42Z3FCGWJZCIDYLU') return true

      // let league = this.scadLeagues.find(l => l.id == this.scadLeagueId)
      // return league.isCurrentlyLoggedInUserACommissioner
    }
  }
}
</script>

<style lang="stylus" scoped>
  a
    color: $info
    text-decoration: none
</style>
