<template lang="pug">
  q-page(v-if="loaded")
    loading(v-if="!loaded" :message="'Updating SCAD with lastest Yahoo! updates'")
    .row.q-gutter-md.full-width.justify-center.q-pt-lg(v-if="league.isActive && !refresh")
      .row.full-width-justify-center
        .div.mobile-hide
          q-avatar(size="75px")
            img(src="//scad-assets.s3.amazonaws.com/statics/yahoo-ff.png")
        .column.justify-center.align-center.text-center
          .text-h4.text-weight-bolder {{league.yahooLeagueDetails.name}}
          a.mobile-hide(:href='league.yahooLeagueDetails.url') {{league.yahooLeagueDetails.url}}
      .row.mobile-hide
        export-league
      .row.full-width.justify-center
        .col-xl-7.col-lg-7.col-md-7.col-sm-12.col-xs-12
          lite-league.gt-xs(@updateTeamSalaries="updateTeamSalaries")
          lite-league-mobile.lt-sm(@updateTeamSalaries="updateTeamSalaries")
          transactions
        .col-xl-4.col-lg-4.col-md-4.col-sm-12.col-xs-12
          franchise-tagged-players
          lite-my-team
      .row.full-width.justify-center(v-if="checkIfCommish(this.league.yahooLeagueId, this.league.yahooCommishLeagues)")
        .col-10
          league-diagnostics
    renew-league-dialog(v-if="checkIfCommish(this.league.yahooLeagueId, this.league.yahooCommishLeagues) && user.user.guid === '2OMLCT3C2A42Z3FCGWJZCIDYLU' && renewLeague")

</template>

<script>
import LiteMyTeam from '../components/LiteMyTeam'
import LiteLeague from '../components/LiteLeague'
import LeagueDiagnostics from '../components/LeagueDiagnostics'
import Transactions from '../components/Transactions'
import LiteLeagueMobile from '../components/LiteLeagueMobile'
import LiteDraftPicks from '../components/LiteDraftPicks'
import ExportLeague from '../components/ExportLeague'
import { checkIfCommish } from '../utilities/validators'
import Loading from '../components/Loading'
import RenewLeagueDialog from '../components/dialogs/renewLeagueDialog'
import FranchiseTagPlayers from '../components/FranchiseTagPlayers.vue'

export default {
  name: 'Dashboard',
  components: {
    'lite-my-team': LiteMyTeam,
    'lite-league': LiteLeague,
    'league-diagnostics': LeagueDiagnostics,
    transactions: Transactions,
    'lite-league-mobile': LiteLeagueMobile,
    'lite-draft-picks': LiteDraftPicks,
    'export-league': ExportLeague,
    'loading': Loading,
    'renew-league-dialog': RenewLeagueDialog,
    'franchise-tagged-players': FranchiseTagPlayers

  },
  data () {
    return {
      loaded: false,
      refresh: false
    }
  },
  async mounted () {
    // await this.$store.dispatch('league/getScadInfo')
    if (!this.league.isActive) {
      this.$router.push('/about')
    } else {
      if (this.league.renewedAvailable && checkIfCommish(this.league.yahooLeagueId, this.league.yahooCommishLeagues)) {
        this.$store.commit('dialog/renewLeague')
      }
      this.loaded = true
    }
  },
  computed: {
    user () { return this.$store.state.user },
    loggedIn () { return this.user.active },
    tokens () { return this.user.tokens },
    league () { return this.$store.state.league },
    scadLeagues () { return this.league.scadLeagues },
    scadLeagueId () { return this.league.scadLeagueId },
    transactionsLoaded () { return this.$store.state.transactions.loaded },
    checkIfCommish () { return checkIfCommish },
    renewLeague () { return this.$store.state.dialog.renewLeague }
  },
  methods: {
    async updateTeamSalaries () {
      this.refresh = true
      await this.$store.dispatch('league/updateTeamSalaries')
      this.refresh = false
    }
  }
}
</script>

<style lang="stylus" scoped>
a
  color: $info
  text-decoration: none
</style>
