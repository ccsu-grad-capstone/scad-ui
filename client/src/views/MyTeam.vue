<template lang="pug">
  body
    q-card.q-ma-md
      | {{this.getTeam()}}
      q-card-section
        q-card
          q-card-section
            .row.q-gutter-md
              .column.bg-red.justify-center
                .row.justify-center
                  q-avatar(size="100px")
                    img(:src="this.getTeam().team_logos[0].url")
                .row.justify-center
                  .text-h6 {{this.getTeam().name}}
              q-separator(vertical)
              .col.q-pa-md
                .row
                  .col
                    .row
                      .col.text-grey-8.text-caption.text-right Remaining Salary:
                      .col-7.text-primary.text-weight-bold
                        |  $TBD
                    .row
                      .col.text-grey-8.text-caption.text-right Available Cap Exemption Give:
                      .col-7.text-primary.text-weight-bold
                        |  $TBD
                  .col.bg-red
                    | {{this.getTeam()}}
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
                      q-avatar
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

<style lang="scss" scoped></style>
