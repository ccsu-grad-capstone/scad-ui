<template lang="pug">
  q-page.flex.flex-center
    q-card.q-pa-md.q-ma-lg(style='width: 100%')
      q-card-section.row
        .text-h4.text-weight-bolder League Settings
      q-separator.q-mb-lg(color='secondary' inset)
      q-list(bordered separator)
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-6.text-body1.text-left
              | Yahoo League Name:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              | {{settings.yahooLeagueName}}
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-6.text-body1.text-left
              | Yahoo League ID:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              | {{settings.yahooLeagueId}}
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-6.text-body1.text-left
              | Yahoo League Homepage:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              a(:href='settings.url') {{league.url}}
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-6.text-body1.text-left
              | Rookie Draft Rounds:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              | {{settings.rookieDraftRds}}
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-6.text-body1.text-left
              | Rookie Draft Strategy:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              | {{settings.rookieDraftStrategy}}
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-6.text-body1.text-left
              | Rookie Wage Scale:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              | {{settings.rookieWageScale}}
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-6.text-body1.text-left
              | Team Salary Cap:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              | ${{settings.teamSalaryCap}}
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-6.text-body1.text-left
              | League Salary Cap:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              | ${{settings.leagueSalaryCap}}
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-6.text-body1.text-left
              | $Salary Cap Exemption Limit:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              | {{settings.salaryCapExemptionLimit}}
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-6.text-body1.text-left
              | IR Relief Percentage:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              | {{settings.irReliefPerc}}%
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-6.text-body1.text-left
              | Franchise Tag Relief Percentage:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              | {{settings.franchiseTagReliefPerc}}%
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-6.text-body1.text-left
              | Franchise Tag Spots:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              | {{settings.franchiseTagSpots}}
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-6.text-body1.text-left
              | Year Limit on Trading Draft Picks in Advance:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              | {{settings.tradingDraftPickYears}}
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-6.text-body1.text-left
              | QB Roster Limits:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              .row.align-center
                | {{ settings.qbMin }}
                .text-caption (min),
                | {{ settings.qbMax }}
                .text-caption (max)
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-6.text-body1.text-left
              | RB Roster Limits:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              .row.align-center
                | {{ settings.rbMin }}
                .text-caption (min),
                | {{ settings.rbMax }}
                .text-caption (max)
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-6.text-body1.text-left
              | WR Roster Limits:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              .row.align-center
                | {{ settings.wrMin }}
                .text-caption (min),
                | {{ settings.wrMax }}
                .text-caption (max)
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-6.text-body1.text-left
              | TE Roster Limits:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              .row.align-center
                | {{ settings.teMin }}
                .text-caption (min),
                | {{ settings.teMax }}
                .text-caption (max)
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-6.text-body1.text-left
              | K Roster Limits:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              .row.align-center
                | {{ settings.kMin }}
                .text-caption (min),
                |
                |
                | {{ settings.kMax }}
                .text-caption (max)
        q-item(clickable)
          .row.full-width.q-pl-lg
            .col-6.text-body1.text-left
              | DEF Roster Limits:
            .col-3.text-body1.q-pl-lg.text-weight-bolder
              .row.align-center
                | {{ settings.defMin }}
                .text-caption (min),
                | {{ settings.defMax }}
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
    if (!this.league.scadSettings.id) { this.$store.dispatch('league/getScadSettings') }
  },
  computed: {
    league () {
      return this.$store.state.league
    },
    settings () {
      return this.$store.state.league.scadSettings
    }
  },
  methods: {
  }
}
</script>

<style lang="stylus" scoped></style>
