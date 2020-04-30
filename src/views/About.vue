<template lang="pug">
  q-page.flex.justify-center
    img(src="../statics/background.jpg" style="width: 100%")
    q-card.q-ma-md(style="width: 100%")
      q-card-section
        .row.full-width.justify-center.q-gutter-sm
          .col
            .row.justify-center.q-gutter-lg
              img(src="../statics/salaries.png" style="height: 125px")
              .text-center.text-body1 Manage your team like a real GM with player salaries, team salary caps, and more..
          q-separator(vertical)
          .col
            .row.justify-center.q-gutter-lg
              img(src="../statics/yahoo-ff.png" style="height: 125px")
              .text-center.text-body1 Built on top of Yahoo, we let them do what they do best and we take care of the rest.
          q-separator(vertical)
          .col
            .row.justify-center.q-gutter-lg
              img(src="../statics/calculator.png" style="height: 125px")
              .text-center.text-body1 Simply set your keepers with Yahoo and we'll re-evalute new salaries year to year based on projections.
          q-separator(vertical)
          .col
            .row.justify-center.q-gutter-lg
              img(src="../statics/spreadsheet.png" style="height: 125px")
              .text-center.text-body1 Designed to replace those hard to keep track of spreadsheets.
    q-card-section()
      .row.full-width.justify-center.items-center
        .col-8
          .text-h6.info-title What is SCAD?
          .info-body SCAD is a GM tool designed to assist #[strong.text-primary Salary Cap and Dynasty (SCAD)] fantasy football leagues hosted on Yahoo.  SCAD gives it's users a way manage salaries and dynasty settings year to year.  SCAD understands the value Yahoo offers it's users and does nothing to take away from that experience by building it's application on top of Yahoo.
          .text-h6.info-title Who is SCAD for?
          .info-body SCAD is developed for the avid fantasy football leagues that struggle managing their leagues salaries, consistant draft pick trading and salary cap exemptions.
          .text-h6.info-title How does SCAD work?
          .info-body SCAD leverages #[strong.yahoo Yahoo's Fantasy Sports API] to retrieve user, league, team and player data from Yahoo to manage and store players salaries.  SCAD has it's own database to manage salaries and other specifc dynasty league settings not available through Yahoo.  Users simply log into SCAD through Yahoo, register their Yahoo league with SCAD, and all their league information will be made available to manage.
          .text-h6.info-title Why choose SCAD?
          .info-body Unlike other sites, SCAD does not recreate the wheel.  Built on top of Yahoo, users still use Yahoo for roster management, free agent and waiver transactions, live scoring updates ect.  SCAD is here as a GM tool to specficlly manage player and team salaries, rookie draft pick trading, salary cap exemption trading, franchise tagging players and more.

      div.q-pt-lg(v-if="!loggedIn")
        .row.full-width.justify-center.text-body2
          | Click here to login with your Yahoo account
        .row.full-width.justify-center.q-pt-sm
          .col-3
            q-btn-group(spread)
              q-btn(label="Log In" color="primary" size="md" @click="loginWithYahoo")
      div.q-pt-lg(v-else)
        .row.full-width.justify-center.text-body2
          | Register your Yahoo Fantasy Football League with us here!
        .row.full-width.justify-center.q-pt-sm
          .col-3
            q-btn-group(spread)
              q-btn(label="Register League" color="primary" size="md" @click="registerLeague")

</template>

<script>
import { getBaseURL } from '../utilities/enviornment'

export default {
  name: 'About',
  data () {
    return {}
  },
  computed: {
    loggedIn () {
      return this.$store.state.user.active
    }
  },
  methods: {
    loginWithYahoo () {
      console.log('[ABOUT] - loginWithYahoo()')
      window.location = `${getBaseURL('NODE')}/auth/yahoo`
    },
    registerLeague () {
      this.$router.push('register-league')
    }
  }
}

</script>
<style lang="stylus">
.info-title
  padding-top: 10px
  padding-bottom: 5px
  font-weight: bolder
.info-body
  font-size: medium
.yahoo
  color: #400090
.LP

  &__background
    background-color: #5f6323
</style>
