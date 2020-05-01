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
      .row.dashboard-width.justify-center
        .row
          .div
            q-avatar(size="85px")
              img(src="../statics/yahoo-ff.png")
          .column.justify-center.align-center.text-center
            .text-h4.text-weight-bolder {{league.yahooLeagueDetails.name}}
            a(:href='league.yahooLeagueDetails.url') {{league.yahooLeagueDetails.url}}
        .row.full-width
          lite-league(@updateTeamSalaries="updateTeamSalaries")
          lite-my-team

</template>

<script>
import LiteMyTeam from '../components/LiteMyTeam'
import LiteLeague from '../components/LiteLeague'
import LiteDraftPicks from '../components/LiteDraftPicks'

export default {
  name: 'Dashboard',
  components: {
    'lite-my-team': LiteMyTeam,
    'lite-league': LiteLeague,
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
    }
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
  .dashboard-width
    width: 1100px
</style>
