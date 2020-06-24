<template lang="pug">
  q-page.justify-center
    img(src="../statics/background4.jpg" style="width: 100%")
    .bg-white
      q-card.shadow-20.q-pa-md
        .row.full-width.justify-center.q-gutter-sm
          .col-xl.col-lg.col-md.col-sm-10.col-xs-10.q-px-sm
            .row.justify-center.q-gutter-lg
              img(src="../statics/salaries.png" style="height: 100px")
              .text-center Manage your team like a real GM with player salaries, team salary caps, and more.
          q-separator.gt-sm(vertical)
          .col-xl.col-lg.col-md.col-sm-10.col-xs-10.q-px-sm
            .row.justify-center.q-gutter-lg
              img(src="../statics/yahoo-ff.png" style="height: 100px")
              .text-center Built on top of Yahoo!, we let them do what they do best and we take care of the rest.
          q-separator.gt-sm(vertical)
          .col-xl.col-lg.col-md.col-sm-10.col-xs-10.q-px-sm
            .row.justify-center.q-gutter-lg
              img(src="../statics/handshake.png" style="height: 100px")
              .text-center Let us keep track of the exhausted draft pick and salary cap exemption trade details.
          q-separator.gt-sm(vertical)
          .col-xl.col-lg.col-md.col-sm-10.col-xs-10.q-px-sm
            .row.justify-center.q-gutter-lg
              img(src="../statics/spreadsheet.png" style="height: 100px")
              .text-center Designed to replace those hard to keep track of spreadsheets.

    .row.full-width.justify-center.lt-md
      div.q-py-lg(v-if="!loggedIn")
        .row.full-width.justify-center.text-body2
          | Click here to login with your Yahoo! account
        .row.full-width.justify-center.q-pt-sm
          .col-3
            q-btn-group(spread)
              q-btn(label="Log In" color="primary" size="md" @click="loginWithYahoo")
      div.q-py-lg(v-else)
        .row.full-width.justify-center.text-body2
          | Register your Yahoo! Fantasy Football League with us here!
        .row.full-width.justify-center.q-pt-sm
          .col-5
            q-btn-group(spread)
              q-btn(label="Register League" color="primary" size="md" @click="registerLeague")
    .row.full-width.justify-end.items-center.bgimg.gt-sm
      .col-5.q-mr-lg.q-mt-lg
        q-card.q-pa-md.card-opacity.shadow-24
          .text-h6.info-title What is SCAD?
          .info-body SCAD is a General Manager tool designed to assist #[strong.text-primary Salary Cap and Dynasty (SCAD)] Fantasy Football leagues hosted on Yahoo!.  SCAD gives its users a way to manage salaries and dynasty settings year to year.  SCAD understands the value Yahoo! offers its users and does nothing to take away from that experience by building its application on top of Yahoo!.
          .text-h6.info-title Who is SCAD for?
          .info-body SCAD is developed for the avid fantasy football leagues that struggle managing their league's salaries, consistent draft pick trading and salary cap exemptions.
          .text-h6.info-title How does SCAD work?
          .info-body SCAD leverages #[strong.yahoo Yahoo!'s Fantasy Sports API] to retrieve user, league, team and player data from Yahoo! to manage and store players’ salaries.  SCAD has its own database to manage salaries and other specific dynasty league settings not available through Yahoo!.  Users simply log into SCAD through Yahoo!, register their Yahoo! league with SCAD, and all their league information will be made available to manage.
          .text-h6.info-title Why SCAD?
          .info-body Unlike other sites, SCAD does not recreate the wheel.  Built on top of Yahoo!, users still use Yahoo! for roster management, free agent and waiver transactions, live scoring updates etc.  SCAD is here as a GM tool to specifically manage player and team salaries, rookie draft pick trading, salary cap exemption trading, franchise tagging players and more.

        div.q-py-lg(v-if="!loggedIn")
          .row.full-width.justify-center.text-body2
            | Click here to login with your Yahoo! account
          .row.full-width.justify-center.q-pt-sm
            .col-3
              q-btn-group(spread)
                q-btn(label="Log In" color="primary" size="md" @click="loginWithYahoo")
        div.q-py-lg(v-else)
          .row.full-width.justify-center.text-body2
            | Register your Yahoo! Fantasy Football League with us here!
          .row.full-width.justify-center.q-pt-sm
            .col-5
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
.card-opacity
  background-color: rgba(255, 255, 255, 0.7)
.logo-div
  background-color: rgba(234, 234, 234, 1)
.bgimg
  background-image: url('../statics/background2.jpg')
  background-size: cover
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
