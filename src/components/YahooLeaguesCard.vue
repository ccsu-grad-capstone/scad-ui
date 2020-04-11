<template lang="pug">
  div.q-pa-md.row.items-start.q-gutter-md
    q-card.q-pa-md.row(style='width: 100%')
      q-item-section
        div.text-h5 {{  }}
        div.text-body1
        q-separator
        q-card-section(horizontal)
          q-card-section.col-3
            |  SCAD Leagues
          q-separator(vertical)
          q-card-section.col-4
            | List of user's SCAD leagues
        q-card-section(horizontal)
          q-card-section.col-3
            |  Yahoo Leagues
          q-separator(vertical)
          q-card-section.col-4
            | List of user's yahoo leagues
</template>

<script>

export default {
  name: 'YahooLeaguesCard',

  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped></style>
