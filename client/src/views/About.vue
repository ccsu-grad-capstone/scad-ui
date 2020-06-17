<template lang="pug">
  q-page.flex.justify-center
    img(src="../statics/background.jpeg" style="width: 100%")
    q-card.q-ma-md(style="width: 100%")
      q-card-section(style="height: 300px")
        .row.full-width.justify-center.items-center.text-h6.text-weight-bold
          | Love Yahoo, but sick of managing the complexities of salary caps on your own?
          br
          | Tried those other dynasty sites but let down when they don't live up to Yahoo?
          br
          | New to dynasty, and looking to start a salary cap league?
          br
          | Look no further..
        div.q-pt-lg(v-if="!loggedIn")
          .row.full-width.justify-center.text-body2
            | Click here to login with your Yahoo account
          .row.full-width.justify-center.q-pt-sm
            q-btn(label="Log In Here" dense no-caps color="primary" size="md" @click="loginWithYahoo")
        div.q-pt-lg(v-else)
          .row.full-width.justify-center.text-body2
            | Register your Yahoo Fantasy Football League with us here!
          .row.full-width.justify-center.q-pt-sm
            q-btn(label="Register League" dense no-caps color="primary" size="md" @click="registerLeague")

      q-separator
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

</template>

<script>
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
    fullName (fname, lname) {
      return `${fname} ${lname}`
    },
    loginWithYahoo () {
      console.log('[ABOUT] - loginWithYahoo()')
      window.location = 'http://localhost:3000/auth/yahoo'
    },
    registerLeague () {
      this.$router.push('register-league')
    }
  }
}

</script>
<style lang="sass">
.LP

  &__background
    background-color: #5f6323
</style>
