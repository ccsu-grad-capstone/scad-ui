<template lang="pug">
  .q-pa-md(style="width: 50%")
    .text-h6.text-weight-bolder My Team
    q-table(
      :data='getPlayers()',
      :columns='columns',
      row-key='playerName',
      :pagination.sync="pagination",
      hide-bottom,
      separator='cell',
      dense
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
      columns: [
        {
          name: 'pos',
          required: true,
          label: 'POS:',
          align: 'center',
          field: row => row.display_position,
          format: val => `${val}`,
          sortable: false,
          // classes: 'bg-secondary ellipsis',
          // style: 'max-width: 10px',
          headerClasses: 'bg-grey-3'
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
