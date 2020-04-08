<template lang="pug">
  q-page.flex(v-if="loaded")
    .row.q-gutter-md.full-width.justify-center.q-pt-lg(v-if="league.isActive")
      .div
        q-avatar(size="85px")
          img(src="../statics/yahoo-ff.png")
      .column.justify-center.align-center.text-center
        .text-h4.text-weight-bolder {{league.yahooLeagueDetails.name}}
        a(:href='league.yahooLeagueDetails.url') {{league.yahooLeagueDetails.url}}
    .row.full-width
      lite-league
      lite-my-team
    my-tokens
    q-separator
    q-card.q-ma-md.q-pa-md
      .text-h6
        | User Details:
      .text-caption
      | {{user.user}}
      .column.items-center.text
        .col.items-center
          q-btn(label='Login to SCAD' dense no-caps color='secondary' text-color='primary' size='md' @click="dashboard")
    q-card.q-ma-md.q-pa-md
      .text-h6
        | League Yahoo Leagues:
      .text-caption
      | {{league.yahooLeagueDetailss}}
      .text-h6
        | League Settings:
      .text-caption
      | {{league.settings}}
      .text-h6
        | League Teams:
      .text-caption
      | {{league.teams}}
      .text-h6
        | League Stadnings:
      .text-caption
      | {{league.standings}}

</template>

<script>
import MyTokens from '../components/MyTokens'
import LiteMyTeam from '../components/LiteMyTeam'
import LiteLeague from '../components/LiteLeague'
import LiteDraftPicks from '../components/LiteDraftPicks'

export default {
  name: 'Dashboard',
  components: {
    'my-tokens': MyTokens,
    'lite-my-team': LiteMyTeam,
    'lite-league': LiteLeague,
    'lite-draft-picks': LiteDraftPicks
  },
  data () {
    return {
      loaded: false
    }
  },
  created () {
    if (!this.league.isActive) {
      this.$router.push('/about')
    } else {
      this.loaded = true
    }
    // this.$store.dispatch('user/refreshToken')
    // this.$store.dispatch('league/getDashboard')
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
</style>
