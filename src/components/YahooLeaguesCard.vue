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
            q-list(bordered separator v-for="(l, index) in scadLeagues" :key="index")
              q-item(clickable v-ripple @click.native="scadOnClick(l.id, l.yahooLeagueId)")
                q-item-section {{getLeagueName(l.yahooLeagueId)}}
        q-card-section(horizontal)
          q-card-section.col-3
            |  Yahoo Leagues
          q-separator(vertical)
          q-card-section.col-4
            q-list(bordered separator v-for="(league, index) in yahooLeagues" :key="index")
              q-item(clickable v-ripple)
                q-item-section
                  q-item-label {{league.name}}

</template>

<script>

export default {
  name: 'YahooLeaguesCard',

  data () {
    return {}
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    scadLeagues () {
      return this.$store.state.league.scadLeagues
    },
    yahooLeagues () {
      return this.$store.state.league.yahooLeagues
    }
  },
  methods: {
    getLeagueName (id) {
      // eslint-disable-next-line eqeqeq
      let league = this.yahooLeagues.find(l => l.league_id == id)
      return league.name
    },
    scadOnClick (scadLeagueId, yahooLeaguedId) {

    }
  }
}
</script>

<style lang="scss" scoped></style>
