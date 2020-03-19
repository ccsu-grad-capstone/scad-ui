<template lang="pug">
  q-page.flex
    .row.q-gutter-md.full-width.justify-center.q-pt-lg
      .div
        q-avatar(size="85px")
          img(src="../statics/yahoo-ff.png")
      .column.justify-center.align-center.text-center
        .text-h4.text-weight-bolder {{league.league.name}}
        a(:href='league.league.url') {{league.league.url}}
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
          q-btn(label='Login to SCAD' dense no-caps color='secondary' text-color='primary' size='md' @click="loginToScad")
    q-card.q-ma-md.q-pa-md
      .text-h6
        | League Details:
      .text-caption
      | {{league.yahooLeagues}}
      .column.items-center.text
        .col.items-center
          q-btn(label='Login to SCAD' dense no-caps color='secondary' text-color='primary' size='md' @click="getAllYahooLeagues")

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
    return {}
  },
  mounted () {
    this.$store.dispatch('user/refreshToken')
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
    async loginToScad () {
      console.log('[DASHBOARD] - loginToScad()')
      await this.$store.dispatch('user/loginToScad')
    },
    async getAllYahooLeagues () {
      console.log('[DASHBOARD] - getAllYahooLeagues()')
      await this.$store.dispatch('league/getAllYahooLeagues')
    }
  }
}
</script>

<style lang="scss" scoped></style>
