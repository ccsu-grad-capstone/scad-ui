<template lang="pug">
  q-page.flex(v-if="loaded")
    .row.q-gutter-md.full-width.justify-center.q-pt-lg(v-if="league.isActive")
      .row.dashboard-width.justify-center
        .row
          .div
            q-avatar(size="85px")
              img(src="../statics/yahoo-ff.png")
          .column.justify-center.align-center.text-center
            .text-h4.text-weight-bolder {{league.yahooLeagueDetails.name}}
            a(:href='league.yahooLeagueDetails.url') {{league.yahooLeagueDetails.url}}
        .row.full-width
          lite-league
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
      loaded: false
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
    async dashboard () {
      console.log('[DASHBOARD] - dashboard()')
      await this.$store.dispatch('user/dashboard')
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
