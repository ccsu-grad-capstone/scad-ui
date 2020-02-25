<template lang="pug">
  body
    q-card.q-ma-md
      q-card-section
        .row.q-gutter-md
          .col-4
            .row.justify-center
              q-avatar(size="100px")
                img(:src="this.getTeam().team_logos[0].url")
            .row.justify-center
              .col
                .row.justify-center
                  .text-h6 {{this.getTeam().name}}
                .row.justify-center
                  .text-caption.text-grey-7 Manager ({{this.getTeam().managers[0].nickname}})
                .row.justify-center
                  .text-caption: a(:href='this.getTeam().url') {{this.getTeam().url}}
          q-separator(vertical)
          .col.q-pa-md
            .row.q-gutter-md
              .col
                .text-primary.text-center.text-weight-bolder
                  | SCAD Details
                .row
                  .col-7.text-grey-8.text-caption.text-right Salary Cap:
                  .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
                    | $250
                .row
                  .col-7.text-grey-8.text-caption.text-right Remaining Salary:
                  .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
                    | $TBD
                .row
                  .col-7.text-grey-8.text-caption.text-right Available Cap Exemption Give:
                  .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
                    | $TBD
                .row
                  .col-7.text-grey-8.text-caption.text-right Available Cap Exemption Take:
                  .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
                    | $TBD
                .row
                  .col-7.text-grey-8.text-caption.text-right Franchise Tag:
                  .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
                    | N/A

              q-separator(vertical)

              .col
                .text-primary.text-center.text-weight-bolder
                  | Yahoo Details
                .row
                  .col-7.text-grey-8.text-caption.text-right Waiver Priority:
                  .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
                    | {{this.getTeam().waiver_priority}}
                .row
                  .col-7.text-grey-8.text-caption.text-right FAAB Remaining Budget:
                  .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
                    | ${{this.getTeam().faab_balance}}
                .row
                  .col-7.text-grey-8.text-caption.text-right Number of Trades:
                  .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
                    | {{this.getTeam().number_of_moves}}
                .row
                  .col-7.text-grey-8.text-caption.text-right Draft Grade:
                  .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
                    | {{this.getTeam().draft_grade}}
                .row
                  .col-7.text-grey-8.text-caption.text-right Franchise Tag:
                  .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
                    | N/A
      q-separator
      q-card-section
        .row.full-width
          div(style="width: 50%")
            q-table(
              :data='getPlayers()',
              :columns='columns',
              row-key='name',
              :pagination.sync="pagination",
              hide-bottom,
              )
              template(v-slot:body-cell-name='props')
                q-td(:props='props')
                  .row.full-width
                    .col-2
                      q-avatar(size="30px")
                       img(:src="props.row.headshot.url" style="width: 85%")
                    .column.justify-center {{props.row.name.full}} ({{props.row.editorial_team_abbr}})

</template>

<script>
import { mapRoster, mapTeam } from '../utilities/helpers/teamHelper'

export default {
  name: 'MyTeam',
  data () {
    return {
      pagination: {
        page: 1,
        rowsPerPage: 0 // 0 means all rows
      },
      columns: [
        {
          name: 'pos',
          required: true,
          label: 'POS:',
          align: 'right',
          field: row => row.display_position,
          format: val => `${val}`,
          sortable: false,
          // classes: 'bg-secondary ellipsis',
          // style: 'max-width: 10px',
          headerClasses: 'bg-grey-3'
        },
        {
          name: 'name',
          required: true,
          label: 'Player:',
          align: 'left',
          sortable: false,
          // classes: 'bg-grey-2 ellipsis',
          style: 'max-width: 200px',
          headerClasses: 'bg-grey-3'
        },
        {
          name: 'salary',
          required: true,
          label: 'Salary:',
          align: 'left',
          // field: row => row.editorial_team_abbr,
          format: val => `${val}`,
          sortable: false,
          headerClasses: 'bg-grey-3',
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
    }
  },
  methods: {
    getPlayers () {
      return mapRoster(this.roster)
    },
    getTeam () {
      return mapTeam(this.team)
    }
  }

}
</script>

<style lang="stylus" scoped>
  .scad-team-settings
    text: $h2
    color: $blue-1
    background-color: $grey-5
</style>
