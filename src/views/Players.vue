<template lang="pug">
  q-page
    .row.full-width.justify-center
      .col-xl-10.col-lg-10.col-md-10.col-sm-12.col-xs-12
        .row.full-width.q-pa-md
          div.text-h4.text-weight-bolder Players
        .row.full-width.q-px-md.gt-sm
          .text-subtitle2.text-grey Current list of all players in SCAD database with their corresponding salaries and team.
        .row.full-width.justify-center.q-pt-md
          .row.full-width.q-gutter-sm.q-px-sm
            .col-xl-2.col-lg-2.col-md-2.col-sm-2.col-xs-3
              q-input(filled dense label="Search by Name" stack-label v-model='filter.search')
            .col-xl-2.col-lg-2.col-md-2.col-sm-2.col-xs-3
              q-select(filled dense label="Team" stack-label v-model='filter.team' :options="filteredTeams" @input="updateTeamFilter()")
            .col-xl-2.col-lg-2.col-md-2.col-sm-2.col-xs-3
              q-select(filled dense label="Position" stack-label :options="referenceData.positionFilter" v-model='filter.position')
            div.q-gutter-sm
              q-btn.q-pa-xs(label='Clear' dense color='primary' text-color='white' size='sm' @click="clearFilter")
        loading(v-if="!loaded" :message="'Fetching SCAD players...'")
        .row.full-width.q-pa-md(v-else)
          div(style="width:100%")
            q-table(
              v-if="loaded"
              dense
              :data='filteredPlayers()'
              :pagination.sync="pagination",
              :columns='windowWidth > 600 ? columns : columnsMobile',
              row-key='name'
              flat
              square
              )
              template(v-slot:body='props')
                q-tr(:props='props')
                  q-td(key='pos' :props='props' auto-width) {{ getPos(props.row.yahooPlayerId) }}
                  q-td(key='playerName' :props='props')
                    .row.full-width
                      .q-pr-sm
                        q-avatar(size="25px")
                          img(:src="getHeadshot(props.row.yahooPlayerId)" style="width: 85%")
                      .col.text-weight-bold.text-body2
                        | {{getPlayerName(props.row.yahooPlayerId)}}
                  q-td(key='team' :props='props')
                    .text-grey {{getNFLTeam(props.row.yahooPlayerId)}}
                  q-td(:class="myTeamStyle(props.row.yahooPlayerId)" key='owner' :props='props')
                    | {{ getOwner(props.row.yahooPlayerId) }}
                  q-td(key='salaryHistory' :props='props' auto-width)
                    q-icon(name="history" color="info" size="xs" @click="playerHistoryDialog(props.row)")
                      q-tooltip View {{ getPlayerName(props.row.yahooPlayerId) }}'s salary history
                  q-td(key='salary' :props='props' auto-width)
                    .text-primary.text-weight-bolder.text-body2.q-pr-sm ${{props.row.salary}}
      player-history-dialog(v-if="playerHistory" :scadPlayer="playerHistoryScadPlayer" :yahooPlayer="getYahooPlayer(yahooPlayers, playerHistoryScadPlayer.yahooPlayerId)")

</template>

<script>
/* eslint-disable eqeqeq */
import referenceData from '../utilities/referenceData'
import { myTeamStyle } from '../utilities/formatters'
import { getHeadshot, getPos, getPlayerName, getNFLTeam, getOwner, searchFilter, positionFilter, getYahooPlayer } from '../utilities/functions'
import Loading from '../components/Loading'
import PlayerHistoryDialog from '../components/dialogs/playerHistoryDialog'

export default {
  components: {
    'loading': Loading,
    'player-history-dialog': PlayerHistoryDialog

  },
  data () {
    return {
      loaded: false,
      playerHistoryScadPlayer: {},
      filter: {
        search: '',
        team: '',
        position: ''
      },
      pagination: {
        page: 1,
        sortBy: 'salary',
        descending: true,
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
        },
        {
          name: 'playerName',
          required: true,
          label: 'Player:',
          align: 'left',
          sortable: false,
          field: row => row.name.full,
          style: 'width: 275px'
        },
        {
          name: 'team',
          required: true,
          label: 'Team:',
          align: 'left',
          sortable: false,
          style: 'width: 275px'
        },
        {
          name: 'owner',
          required: true,
          label: 'Owner:',
          align: 'left',
          sortable: false,
          style: 'width: 250px'
        },
        {
          name: 'salaryHistory',
          label: '',
          align: 'left',
          sortable: false
        },
        {
          name: 'salary',
          required: true,
          label: 'Salary:',
          align: 'center',
          field: row => row.salary,
          sortable: true
        }
      ],
      columnsMobile: [
        {
          name: 'playerName',
          required: true,
          label: 'Player:',
          align: 'left',
          sortable: false,
          field: row => row.name.full,
          style: 'width: 275px'
        },
        {
          name: 'owner',
          required: true,
          label: 'Owner:',
          align: 'left',
          sortable: false,
          style: 'width: 250px'
        },
        {
          name: 'salary',
          required: true,
          label: 'Salary:',
          align: 'center',
          field: row => row.salary,
          sortable: true
        }
      ]
    }
  },
  mounted () {
    this.getPlayers()
  },
  computed: {
    referenceData () {
      return referenceData
    },
    searchFilter () {
      return searchFilter
    },
    positionFilter () {
      return positionFilter
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
    myYahooTeamId () {
      return this.$store.state.team.myYahooTeamId
    },
    filteredTeams () {
      return this.yahooTeams.map(t => Object.assign({}, t, { value: t.name, label: t.name }))
    },
    playerHistory () { return this.$store.state.dialog.playerHistory },
    getYahooPlayer () { return getYahooPlayer }

  },
  methods: {
    async getPlayers () {
      await this.$store.dispatch('player/getAllPlayers')
      this.loaded = true
    },
    myTeamStyle (yahooPlayerId) {
      if (this.loaded) {
        return myTeamStyle(yahooPlayerId, this.yahooTeams, this.yahooPlayers, this.myYahooTeamId)
      }
    },
    getHeadshot (id) {
      if (this.loaded) {
        return getHeadshot(id, this.yahooPlayers)
      }
    },
    getPos (id) {
      if (this.loaded) {
        return getPos(id, this.yahooPlayers)
      }
    },
    getPlayerName (id) {
      if (this.loaded) {
        return getPlayerName(id, this.yahooPlayers)
      }
    },
    getNFLTeam (id) {
      if (this.loaded) {
        return getNFLTeam(id, this.yahooPlayers)
      }
    },
    getOwner (yahooPlayerId) {
      if (this.loaded) {
        return getOwner(yahooPlayerId, this.yahooTeams, this.yahooPlayers).name
      }
    },
    async updateTeamFilter () {
      this.loaded = false
      await this.$store.dispatch('player/getTeamScadPlayers', this.filter.team.team_id)
      this.loaded = true
    },
    clearFilter () {
      this.$store.dispatch('player/getAllPlayers')
      this.filter = {
        search: '',
        team: '',
        position: ''
      }
    },
    playerHistoryDialog (player) {
      this.playerHistoryScadPlayer = player
      this.$store.commit('dialog/playerHistory')
    },
    filteredPlayers () {
      var filtered = this.scadPlayers
      Object.keys(this.filter).forEach(key => {
        if (this.filter[key] !== '') {
          if (key === 'search') {
            filtered = filtered.filter(p => searchFilter(p.yahooPlayerId, this.yahooPlayers, this.filter))
          } else if (key === 'position') {
            filtered = filtered.filter(p => positionFilter(p.yahooPlayerId, this.yahooPlayers, this.filter))
          }
        }
      })
      return filtered
    }
  }
}
</script>

<style lang="stylus" scoped>
  .players-width
    width: 1100px
</style>
