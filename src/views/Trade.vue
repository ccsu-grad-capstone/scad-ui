<template lang="pug">
  .row
    .col-5.q-pa-md
      q-select.q-pa-lg(square dense v-model='myTeam' label='MyTeam')
      .text-weight-bold Team Salary: $240
      q-table(
        :data='getPlayers()',
        :columns='columns',
        row-key='player_key',
        :pagination.sync="pagination",
        hide-bottom,
        dense,
        selection='multiple'
        :selected.sync='myTeamSelected'
        )
      div.q-pa-md
      div
        .text-body1.text-weight-bold Draft Picks
        q-markup-table(separator="cell" dense)
          thead
            tr
              th.text-left(style="width: 20px") Year
              th.text-left(style="width: 20px") Round
              th.text-left Owner
              th.text-right(style="width: 20px") Pick

          tbody
            tr
              td.text-center 2020
              td.text-center 2
              td.text-left GoldDiggers
              td.text-center 2
            tr
              td.text-center 2020
              td.text-center 2
              td.text-left GoldDiggers
              td.text-center 13
            tr
              td.text-center 2020
              td.text-center 3
              td.text-left GoldDiggers
              td.text-center 9
            tr
              td.text-center 2021
              td.text-center 1
              td.text-left GoldDiggers
              td.text-center -
            tr
              td.text-center 2021
              td.text-center 2
              td.text-left GoldDiggers
              td.text-center -
            tr
              td.text-center 2021
              td.text-center 3
              td.text-left GoldDiggers
              td.text-center -
            tr
              td.text-center 2022
              td.text-center 1
              td.text-left GoldDiggers
              td.text-center -
            tr
              td.text-center 2022
              td.text-center 2
              td.text-left GoldDiggers
              td.text-center -
            tr
              td.text-center 2022
              td.text-center 3
              td.text-left GoldDiggers
              td.text-center -

    .col-5.q-pa-md
      q-select.q-pa-lg(square dense v-model='myTeam' label='Opposing Team')
      q-table(
        :data='getPlayers()',
        :columns='columns',
        row-key='player_key',
        :pagination.sync="pagination",
        hide-bottom,
        dense,
        selection='multiple'
        :selected.sync='otherTeamSelected'
        )

</template>

<script>
import { mapRoster } from '../utilities/helpers/teamHelper'

export default {
  name: 'LiteMyTeam',
  data () {
    return {
      pagination: {
        page: 1,
        rowsPerPage: 0
      },
      myTeamSelected: [],
      otherTeamSelected: [],
      myTeam: 'GoldDiggers',
      columns: [
        {
          name: 'pos',
          required: true,
          label: 'POS:',
          align: 'center',
          field: row => row.display_position,
          format: val => `${val}`,
          sortable: false
          // classes: 'bg-secondary ellipsis',
          // style: 'max-width: 10px',
          // headerClasses: 'bg-grey-3'
        },
        {
          name: 'playerName',
          required: true,
          label: 'Player:',
          align: 'left',
          field: row => row,
          format: val => `${val.name.full} (${val.editorial_team_abbr})`,
          sortable: false,
          // classes: 'bg-grey-2 ellipsis',
          style: 'max-width: 200px'
          // headerClasses: 'bg-grey-3'
        },
        {
          name: 'salary',
          required: true,
          label: 'Salary:',
          align: 'left',
          // field: row => row.editorial_team_abbr,
          format: val => `${val}`,
          sortable: false,
          // headerClasses: 'bg-grey-3'
          style: 'max-width: 100px'
        }
      ]
    }
  },
  computed: {
    team () {
      return this.$store.state.team.team.info
    },
    roster () {
      return this.$store.state.team.team.roster
    },
    info () {
      return this.$store.state.team.team.info
    }
  },
  methods: {
    getPlayers () {
      return mapRoster(this.roster)
    },
    getPic () {

    }
  }

}
</script>

<style lang="scss" scoped></style>
