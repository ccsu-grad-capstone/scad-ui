<template lang="pug">
  body
    .row.q-gutter-md.q-pa-md(v-if="loaded")
      .row.full-width.bg-red
      .col-4
        .row.justify-center
          q-avatar(size="100px")
            img(:src="yahooTeam.team_logos[0].team_logo.url")
        .row.justify-center
          .col
            .row.justify-center
              .text-h6 {{yahooTeam.name}}
            .row.justify-center
              .text-caption.text-grey-7 Manager ({{yahooTeam.managers[0].nickname}})  | team_key {{this.$route.params.team_key}}
            .row.justify-center
              .text-caption: a(:href='yahooTeam.url') {{yahooTeam.url}}
      q-separator(vertical)
      .col.q-pa-sm
        .row.q-gutter-xs
          .col
            .text-primary.text-center.text-weight-bolder
              | SCAD Details
            .row
              .col-8.text-grey-8.text-caption.text-right Salary Cap:
              .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
                | ${{teamSalaryCap}}
            .row
              .col-8.text-grey-8.text-caption.text-right Current Team Salary:
              .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
                | ${{scadTeam.salary}}
            .row
              .col-8.text-grey-8.text-caption.text-right Available Cap Exemption Give:
              .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
                | ${{salaryCapExemptionLimit - scadTeam.exceptionOut}}
            .row
              .col-8.text-grey-8.text-caption.text-right Available Cap Exemption Take:
              .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
                | ${{salaryCapExemptionLimit - scadTeam.exceptionIn}}
            .row
              .col-8.text-grey-8.text-caption.text-right Franchise Tag:
              .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
                | {{scadTeam.isFranchiseTag}}

          q-separator(vertical)

          .col
            .text-primary.text-center.text-weight-bolder
              | Yahoo Details
            .row
              .col-8.text-grey-8.text-caption.text-right Waiver Priority:
              .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
                | {{yahooTeam.waiver_priority}}
            .row
              .col-8.text-grey-8.text-caption.text-right FAAB Remaining Budget:
              .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
                | ${{yahooTeam.faab_balance}}
            .row
              .col-8.text-grey-8.text-caption.text-right Number of Moves:
              .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
                | {{yahooTeam.number_of_moves}}
            .row
              .col-8.text-grey-8.text-caption.text-right Draft Grade:
              .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
                | {{yahooTeam.draft_grade}}
            .row
              .col-8.text-grey-8.text-caption.text-right Franchise Tag:
              .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
                | N/A
      q-separator
      .row.full-width.justify-center
        div(style="width: 55%")
          .row.full-width.justify-between.q-pa-sm
            q-select(square dense v-model='selectedTeam' :options="filteredTeams" style="width: 250px" @input="updateTeamPage")
            div.q-gutter-sm
              q-btn(v-if="!franchiseTag && !editSalaries" label='Franchise Tag' dense color='secondary' text-color='primary' size='sm' @click="franchiseTag = !franchiseTag")
              q-btn(v-if="franchiseTag && !editSalaries" label='Save Franchise Tag' dense color='primary' text-color='white' size='sm' @click="saveFranchiseTag()")
              q-btn(v-if="!editSalaries && !franchiseTag" label='Edit Salaries' dense color='secondary' text-color='primary' size='sm' @click="editSalaries = !editSalaries")
              q-btn(v-if="editSalaries && !franchiseTag" label='Save Salaries' dense color='primary' text-color='white' size='sm' @click="saveSalaries()")
          q-table(
            v-if="loaded"
            :data='players',
            :columns='columns',
            row-key= 'player_key',
            :pagination.sync="pagination",
            hide-bottom,
            dense,
            selection='single'
            :selected.sync='selected'
            )
            template(v-slot:body='props')
              q-tr(:props='props')
                q-td: q-checkbox(dense v-model='props.selected' :disable="!franchiseTag ? true : false" :color="franchiseTag ? color='info' : color='grey'"  keep-color)
                q-td(key='pos' :props='props' auto-width) {{ props.row.display_position }}
                q-td(key='playerName' :props='props')
                  .row.full-width
                    .col-1.q-pl-xs.-right
                      q-avatar(size="25px")
                        img(:src="props.row.headshot.url" style="width: 85%")
                      | {{props.row.name.full}} ({{props.row.editorial_team_abbr}})
                      q-badge(v-if="checkTag(props.row.player_id)" color='white'): q-icon( name='fas fa-tag' color='info')
                    .col.justify-center
                q-td(key='salary' :props='props' auto-width)
                  .col(:style=" editSalaries ? 'border: 1px solid #26A69A;' : 'border: none;' ")
                    | ${{ getPlayerSalary(props.row.player_id) }}
                  q-popup-edit(
                    v-if="editSalaries"
                    :cover="false"
                    color="primary"
                    title='Update Salary'
                    v-model.number='editPlayer.salary'
                    buttons
                    label-set="Save"
                    @before-show="editingPlayer(props.row)"
                    @save="savePlayer"
                    @cancel="cancelEdit()"
                    )
                    q-input(type='number' v-model='editPlayer.salary' dense autofocus)
</template>

<script>

export default {
  name: 'Team',
  data () {
    return {
      loaded: false,
      scadTeam: {},
      editPlayer: {},
      editPlayerInitSalary: 0,
      selectedTeam: 'Choose a Team',
      editSalaries: false,
      franchiseTag: false,
      selected: [],
      pagination: {
        page: 1,
        rowsPerPage: 0 // 0 means all rows
      },
      columns: [
        {
          name: 'pos',
          required: true,
          label: 'POS:',
          // align: 'right',
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
          // classes: 'bg-grey-2 ellipsis',
          style: 'max-width: 150px'
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
  async created () {
    // console.log('[TEAM] - created()')
    await this.getTeam(this.$route.params.team_id)
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    yahooTeams () {
      return this.$store.state.league.yahooTeams
    },
    yahooLeagueID () {
      return this.$store.state.league.yahooLeagueID
    },
    myYahooTeamID () {
      return this.$store.state.team.myYahooTeamID
    },
    yahooTeam () {
      return this.$store.state.team.yahooTeam
    },
    players () {
      return this.yahooTeam.roster.players
    },
    league () {
      return this.$store.state.league
    },
    filteredTeams () {
      return this.yahooTeams.map(t => Object.assign({}, t, { value: t.name, label: t.name }))
    },
    salaryCapExemptionLimit () {
      return this.$store.state.league.scadSettings.salaryCapExemptionLimit
    },
    teamSalaryCap () {
      return this.$store.state.league.scadSettings.teamSalaryCap
    },
    getTeamSalary () {
      if (this.loaded) {
        let salary = 0
        this.scadTeam.players.forEach(p => {
          salary += p.salary
        })
        return salary
      } else { return 0 }
    }
  },
  methods: {
    async getTeam (yahooTeamID) {
      // console.log(`[TEAM] - getTeam(${yahooTeamID})`)
      await this.$store.dispatch('team/getTeam', { yahooLeagueId: this.yahooLeagueID, yahooTeamId: yahooTeamID })
      this.scadTeam = this.$store.state.team.scadTeam
      this.loaded = true
    },
    async saveSalaries () {
      console.log(`[TEAM] - saveSalaries()`)
      this.editSalaries = false
      // this.$store.dispatch('team/saveSalaries')
    },
    async saveFranchiseTag () {
      console.log(`[TEAM] - saveFranchiseTag()`)
      // eslint-disable-next-line eqeqeq
      let player = this.scadTeam.players.find(p => p.yahooLeaguePlayerId == this.selected[0].player_id)
      let initSalary = player.salary

      // Update franchiseTagReliefPerc to franchiseTagForgivanceAmount
      let franchiseTagReliefPerc = this.league.scadSettings.franchiseTagReliefPerc
      if (player.salary <= franchiseTagReliefPerc) {
        player.salary = 0
      } else {
        player.salary -= franchiseTagReliefPerc
      }
      player.salary = player.salary * (franchiseTagReliefPerc / 100)
      player.isFranchiseTag = true
      this.$store.dispatch('team/savePlayer', player)

      // Update SCAD-TEAM
      this.scadTeam.isFranchiseTag = true
      this.scadTeam.salary += (player.salary - initSalary)
      this.$store.dispatch('team/saveTeam', this.scadTeam)

      this.franchiseTag = false
    },
    async updateTeamPage (teamName) {
      console.log(`[TEAM] - updateTeamPage()`, this.selectedTeam.team_id)
      this.$router.replace({ path: `/team/${this.selectedTeam.team_id}` })
      this.getTeam(this.selectedTeam.team_id)
    },
    editingPlayer (yahooPlayer) {
      // eslint-disable-next-line eqeqeq
      this.editPlayer = this.scadTeam.players.find(p => p.yahooLeaguePlayerId == yahooPlayer.player_id)
      this.editPlayerInitSalary = this.editPlayer.salary
    },
    async savePlayer () {
      this.$store.dispatch('team/savePlayer', this.editPlayer)

      // Update SCAD-TEAM
      this.scadTeam.salary += (this.editPlayer.salary - this.editPlayerInitSalary)
      this.$store.dispatch('team/saveTeam', this.scadTeam)

      this.editPlayer = {}
      this.editPlayerInitSalary = 0
    },
    cancelEdit () {
      // eslint-disable-next-line eqeqeq
      let player = this.scadTeam.players.find(p => p.yahooLeaguePlayerId === this.editPlayer.yahooLeaguePlayerId)
      player.salary = this.editPlayerInitSalary
      this.editPlayer = {}
      this.editPlayerInitSalary = 0
    },
    getPlayerSalary (id) {
      if (this.loaded) {
        // eslint-disable-next-line eqeqeq
        let player = this.scadTeam.players.find(p => p.yahooLeaguePlayerId == id)
        return player.salary
      }
    },
    checkTag (id) {
      // eslint-disable-next-line eqeqeq
      let player = this.scadTeam.players.find(p => p.yahooLeaguePlayerId == id)
      if (player.isFranchiseTag) {
        return true
      } else {
        return false
      }
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
