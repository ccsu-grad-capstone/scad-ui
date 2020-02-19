<template lang="pug">
  q-page.flex.justify-center
    q-card.q-ma-md(style="width: 100%")
      q-card-section
        .column.items-center
          img(src="../statics/scad-logo_v1_700x500.png" style="width: 60%")
      q-card-section(style="height: 300px")
        .row.full-width.justify-center.items-center.text-h6.text-weight-bold
          | Love Yahoo, but sick of managing the complexities of salary caps on your own?
          br
          | Tried those other dynasty sites but let down when they don't live up to Yahoo?
          br
          | New to dynasty, and looking to start a salary cap league?
          br
          | Look no further..
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
  methods: {

  }
}

</script>
<style lang="sass">
.LP

  &__background
    background-color: #5f6323
</style>
