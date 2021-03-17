<template lang="pug">
  body
    .row.q-gutter-md.full-width.justify-center.q-pt-lg
      .div
        q-avatar(size="85px")
          img(src="//scad-assets.s3.amazonaws.com/statics/yahoo-ff.png")
      .column.justify-center.align-center.text-center
        .text-h4.text-weight-bolder {{league.name}}
        a(:href='league.url') {{league.url}}

    .row.q-gutter-md.full-width.q-pt-lg
      div(style="width: 50%")
        q-table(
          :data='league.standings.teams.team',
          :columns='columns',
          row-key='name',
          :pagination.sync="pagination",
          hide-bottom,
          dense
          )
          template(v-slot:body-cell-name='props')
            q-td(:props='props')
              .row.full-width
                .col-2
                  q-avatar(size="25px")
                    img(:src="props.row.team_logos.team_logo.url")
                .column.justify-center
                  router-link(:to="{ path: `team:${props.row.team_key}`}") {{props.row.name}}

</template>

<script>

export default {
  name: 'LeagueHome',
  data () {
    return {
      pagination: {
        page: 1,
        rowsPerPage: 0 // 0 means all rows
      },
      columns: [
        {
          name: 'rank',
          required: true,
          align: 'right',
          field: row => row.team_standings.rank,
          format: val => `${val}`,
          sortable: false,
          // classes: 'bg-secondary ellipsis',
          style: 'max-width: 10px',
          headerClasses: 'bg-grey-4'
        },
        {
          name: 'name',
          required: true,
          label: 'Player:',
          align: 'left',
          sortable: false,
          // classes: 'bg-grey-2 ellipsis',
          style: 'max-width: 200px',
          headerClasses: 'bg-grey-4'
        },
        {
          name: 'record',
          required: true,
          label: 'Record:',
          align: 'left',
          field: row => row.team_standings.outcome_totals,
          format: val => `${val.wins}-${val.losses}-${val.ties}`,
          sortable: false,
          headerClasses: 'bg-grey-4',
          style: 'max-width: 100px'
        },
        {
          name: 'salary',
          required: true,
          label: 'Team Salary',
          align: 'center',
          // field: row => row.team_standings.outcome_totals,
          format: val => `${val}`,
          sortable: false,
          headerClasses: 'bg-grey-4',
          style: 'max-width: 100px'
        }
      ]
    }
  },
  computed: {
    team () {
      return this.$store.state.roster.team
    },
    roster () {
      return this.$store.state.roster.roster
    },
    league () {
      return this.$store.state.league.yahooLeague
    }
  },
  methods: {
  }

}
</script>

<style lang="stylus" scoped>
  .scad-team-settings
    text: $h2
    color: $blue-1
    background-color: $grey-5
</style>
