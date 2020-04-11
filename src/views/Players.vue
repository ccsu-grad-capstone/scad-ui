<template lang="pug">
  body
    .row.q-gutter-md.q-pa-md
      .text-h4.text-weight-bolder Players
      .row.full-width.justify-right
        div(style="width: 85%")
          .row.full-width.q-gutter-sm.q-pa-sm
            .col-3
              q-input( filled dense label="Search by Name" stack-label v-model='filter.search')
            .col-3
              q-select(filled dense label="Team" stack-label v-model='filter.team' :options="filteredTeams" @input="updateTeamFilter()")
            .col-3
              q-select( filled dense label="Position" stack-label :options="referenceData.position" v-model='filter.position')
            .col.q-pt-sm
              q-btn(label='Clear' dense color='primary' text-color='white' size='sm' @click="clearFilter")
          .q-pa-md
            q-table(
              dense
              :data='filteredPlayers()'
              :pagination.sync="pagination",
              :columns='columns'
              row-key='name')
              template(v-slot:body='props')
                q-tr(:props='props')
                  q-td(key='pos' :props='props' auto-width) {{ props.row.display_position }}
                  q-td(key='playerName' :props='props')
                    .row.full-width
                      .q-pr-sm
                        q-avatar(size="25px")
                          img(:src="props.row.headshot.url" style="width: 85%")
                      .col.text-weight-bold.text-body2
                        | {{props.row.name.full}}
                  q-td(key='team' :props='props')
                    .text-grey {{ props.row.editorial_team_full_name }}
                  q-td(key='owner' :props='props' auto-width)
                    | {{ getOwner(props.row.player_id) }}
                  q-td(key='salary' :props='props' auto-width)
                    .text-primary.text-weight-bolder.text-body2.q-pr-sm ${{ getPlayerSalary(props.row.player_id) }}

</template>

<script>
import referenceData from '../utilities/referenceData'
export default {
  data () {
    return {
      loaded: false,
      filter: {
        search: '',
        team: '',
        position: ''
      },
      pagination: {
        page: 1,
        rowsPerPage: 30 // 0 means all rows
      },
      columns: [
        {
          name: 'pos',
          required: true,
          label: 'POS:',
          align: 'center',
          field: row => row.display_position,
          format: val => `${val}`,
          sortable: true
          // classes: 'bg-secondary ellipsis',
          // style: 'max-width: 10px',
          // headerClasses: 'bg-grey-3'
        },
        {
          name: 'playerName',
          required: true,
          label: 'Player:',
          align: 'left',
          sortable: false,
          field: row => row.name.full,
          // classes: 'bg-grey-2 ellipsis',
          style: 'width: 225px'
          // headerClasses: 'bg-grey-3'
        },
        {
          name: 'team',
          required: true,
          label: 'Team:',
          align: 'left',
          sortable: false
          // classes: 'bg-grey-2 ellipsis',
          // style: 'width: 150px'
          // headerClasses: 'bg-grey-3'
        },
        {
          name: 'owner',
          required: true,
          label: 'Owner:',
          align: 'left',
          sortable: false
          // classes: 'bg-grey-2 ellipsis',
          // style: 'width: 150px'
          // headerClasses: 'bg-grey-3'
        },
        {
          name: 'salary',
          required: true,
          label: 'Salary:',
          align: 'center',
          // field: row => this.yahooTeam.team_key,
          // format: val => `${val}`,
          sortable: true
          // headerClasses: 'bg-grey-3',
          // // style: 'max-width: 100px'
        }
      ]
    }
  },
  mounted () {
    this.loaded = true
    this.$store.dispatch('player/getAllPlayers')
  },
  computed: {
    referenceData () {
      return referenceData
    },
    scadPlayers () {
      return this.$store.state.player.scadPlayers
    },
    yahooPlayers () {
      return this.$store.state.player.yahooPlayers
    },
    scadTeams () {
      return this.$store.state.league.scadTeams
    },
    yahooTeams () {
      return this.$store.state.league.yahooTeams
    },
    filteredTeams () {
      return this.yahooTeams.map(t => Object.assign({}, t, { value: t.name, label: t.name }))
    }
  },
  methods: {
    getPlayerSalary (id) {
      if (this.loaded) {
        // eslint-disable-next-line eqeqeq
        let player = this.scadPlayers.find(p => p.yahooLeaguePlayerId == id)
        return player.salary
      }
    },
    getOwner (id) {
      if (this.loaded) {
        // eslint-disable-next-line eqeqeq
        let player = this.scadPlayers.find(p => p.yahooLeaguePlayerId == id)
        // eslint-disable-next-line eqeqeq
        let scadTeam = this.scadTeams.find(t => t.id == player.scadTeamId)
        // eslint-disable-next-line eqeqeq
        let yahooTeam = this.yahooTeams.find(t => t.team_id == scadTeam.yahooLeagueTeamId)
        return yahooTeam.name
      }
    },
    getTeam (yahooPlayerId) {
      if (this.loaded) {
        // eslint-disable-next-line eqeqeq
        let team = this.scadPlayers.find(p => p.yahooLeaguePlayerId == yahooPlayerId)
        return team.salary
      }
    },
    async updateTeamFilter () {
      this.$store.dispatch('player/getTeamYahooPlayers', this.filter.team.team_id)
    },
    clearFilter () {
      this.$store.dispatch('player/getAllPlayers')
      this.filter = {
        search: '',
        team: '',
        position: ''
      }
    },
    filteredPlayers () {
      var filtered = this.yahooPlayers
      Object.keys(this.filter).forEach(key => {
        if (this.filter[key] !== '') {
          if (key === 'search') {
            filtered = filtered.filter(p => p.name.full.toLowerCase().includes(this.filter[key].toLowerCase()))
          } else if (key === 'position') {
            filtered = filtered.filter(p => p.display_position === this.filter[key])
          }
        }
      })
      return filtered
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
