<template lang="pug">
  q-page.flex
    .row.q-gutter-md.full-width.justify-center.q-pt-lg
      .div
        q-avatar(size="85px")
          img(src="../statics/yahoo-ff.png")
      .column.justify-center.align-center.text-center
        .text-h4.text-weight-bolder {{league.name}}
        a(:href='league.url') {{league.url}}
    .row.wrap
      lite-league
      lite-my-team
      lite-draft-picks
    my-tokens
    q-separator
    q-card.q-ma-md
      q-card-section
      .text-h6
        | User details:
        .text-caption
        | {{user.user}}
      .column.items-center.text
        .row.full-width.justify-center.items-center.q-pt-lg
          .column.col.items-center
            q-btn(label='Register League' dense no-caps color='secondary' text-color='primary' size='md' @click="$router.push('register-league')")
        .row.full-width.justify-center.items-center.q-pt-lg
          .column.col.items-center
            q-btn(label='Login to SCAD' dense no-caps color='secondary' text-color='primary' size='md' @click="loginToScad")

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
      return this.$store.state.league.league
    }
  },
  methods: {
    async loginToScad () {
      console.log('[DASHBOARD] - loginToScad()')
      await this.$store.dispatch('user/loginToScad')
    }
  }
}
</script>

<style lang="scss" scoped></style>
