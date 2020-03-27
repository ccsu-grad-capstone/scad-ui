<template lang="pug">
  q-page.flex.flex-center
    q-card.q-pa-md.q-ma-lg(style='width: 100%')
      q-card-section.row
        .text-h4.text-weight-bolder League Settings
      q-separator.q-mb-lg(color='secondary' inset)
      q-list(bordered separator)
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-4.text-body1.text-left
              | Yahoo League Name:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              | {{league.name}}
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-4.text-body1.text-left
              | Yahoo League ID:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              | {{league.league_id}}
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-4.text-body1.text-left
              | Yahoo League Homepage:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              a(:href='league.url') {{league.url}}
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-4.text-body1.text-left
              | Trade Deadline Date:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              | {{settings.trade_end_date}}
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-4.text-body1.text-left
              | Rookie Draft Rounds:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              | {{settings.rookieDraftRds}}
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-4.text-body1.text-left
              | Rookie Draft Strategy:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              | {{settings.rookieDraftStrategy}}
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-4.text-body1.text-left
              | Rookie Wage Scale:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              | {{settings.rookieWageScale}}
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-4.text-body1.text-left
              | Team Salary Cap:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              | {{settings.teamCap}}
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-4.text-body1.text-left
              | League Salary Cap:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              | {{settings.leagueCap}}
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-4.text-body1.text-left
              | Salary Cap Exemption Limit:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              | {{settings.salaryCapExemptionLimit}}
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-4.text-body1.text-left
              | IR Relief Percentage:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              | {{settings.irReliefPerc}}
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-4.text-body1.text-left
              | Franchise Tag Relief Percentage:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              | {{settings.franchiseTagReliefPerc}}
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-4.text-body1.text-left
              | Franchise Tag Spots:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              | {{settings.franchiseTagSpots}}
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-4.text-body1.text-left
              | Year Limit on Trading Draft Picks in Advance:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              | {{settings.tradingDraftPickYears}}
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-4.text-body1.text-left
              | QB Roster Limits:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              .row.align-center
                | 3
                .text-caption (min),
                | 6
                .text-caption (max)
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-4.text-body1.text-left
              | RB Roster Limits:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              .row.align-center
                | 3
                .text-caption (min),
                | 6
                .text-caption (max)
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-4.text-body1.text-left
              | WR Roster Limits:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              .row.align-center
                | 3
                .text-caption (min),
                | 6
                .text-caption (max)
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-4.text-body1.text-left
              | TE Roster Limits:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              .row.align-center
                | 3
                .text-caption (min),
                | 6
                .text-caption (max)
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-4.text-body1.text-left
              | K Roster Limits:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              .row.align-center
                | 3
                .text-caption (min),
                |
                |
                | 6
                .text-caption (max)
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-4.text-body1.text-left
              | DEF Roster Limits:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              .row.align-center
                | 3
                .text-caption (min),
                | 6
                .text-caption (max)

</template>

<script>

export default {
  name: 'RegisterLeague',
  components: {
  },
  data () {
    return {
    }
  },
  mounted () {
    // this.$store.dispatch('league/getSettings')
  },
  computed: {
    league () {
      return this.$store.state.league.yahooLeague
    },
    settings () {
      return this.$store.state.league.settings
    }
  },
  methods: {
  }
}
</script>

<style lang="stylus" scoped></style>
