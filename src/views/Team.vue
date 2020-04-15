<template lang="pug">
  body
    .row.q-gutter-md.q-pa-md
      .row.full-width.bg-red
      .col-4
        .row.justify-center
          q-avatar(size="100px")
            img( :src="yahooTeam.team_logos[0].team_logo.url")
        .row.justify-center
          .col
            .row.justify-center
              .text-h6 {{yahooTeam.name}}
            .row.justify-center
              .text-caption.text-grey-7(v-if="loaded") Manager ({{yahooTeam.managers[0].manager.nickname}})  | team_id: {{yahooTeam.team_id}}
            .row.justify-center
              .text-caption: a(:href='yahooTeam.url') Yahoo Team Page
      q-separator(vertical)
      .col.q-pa-sm
        .row.q-gutter-xs
          .col
            .text-primary.text-center.text-weight-bolder
              | SCAD Details
            .row
              .col-7.text-grey-8.text-caption.text-right Salary Cap:
              .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
                | ${{teamSalaryCap}}
            .row
              .col-7.text-grey-8.text-caption.text-right Current Team Salary:
              .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
                | ${{scadTeam.salary}}
            .row
              .col-7.text-grey-8.text-caption.text-right Available Cap Exemption Give:
              .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
                | ${{salaryCapExemptionLimit - scadTeam.exceptionOut}}
            .row
              .col-7.text-grey-8.text-caption.text-right Available Cap Exemption Take:
              .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
                | ${{salaryCapExemptionLimit - scadTeam.exceptionIn}}
            .row
              .col-7.text-grey-8.text-caption.text-right Franchise Tag:
              .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
                span(v-if="scadSettings.franchiseTagSpots > 0") {{franchiseTagDisplay()}}
                span(v-else) N/A

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
      q-separator
      .col-8
        .row.full-width.justify-between.q-px-sm
          q-select(square dense v-model='selectedTeam' :options="filteredTeams" style="width: 250px" @input="updateTeamPage")
          div.q-gutter-sm.q-pt-md
            div
            q-btn(v-if="!franchiseTag && !editSalaries && scadSettings.franchiseTagSpots > 0" label='Franchise Tag' dense color='secondary' text-color='primary' size='sm' @click="franchiseTag = !franchiseTag")
            q-btn(v-if="franchiseTag && !editSalaries && scadSettings.franchiseTagSpots > 0" label='Cancel' dense color='primary' text-color='white' size='sm' @click="franchiseTag = false")
            q-btn(v-if="!editSalaries && !franchiseTag" label='Edit Salaries' dense color='secondary' text-color='primary' size='sm' @click="editSalaries = !editSalaries")
            q-btn(v-if="editSalaries && !franchiseTag" label='Done' dense color='primary' text-color='white' size='sm' @click="saveSalaries()")
      .row.full-width.q-pl-lg(v-if="loaded")
        .col-8
          q-table(
            class="my-sticky-header-table"
            v-if="loaded"
            :data='players',
            :columns='columns',
            row-key= 'player_key',
            :pagination.sync="pagination",
            hide-bottom,
            dense
            )
            template(v-slot:body='props')
              q-tr(:props='props')
                q-td(auto-width)
                  div(v-if="franchiseTag")
                    div(v-if="scadTeam.isFranchiseTag")
                      q-btn(v-if="checkTag(props.row.player_id)" size='xs' color='negative' round dense @click='removeFranchiseTag(props.row)' icon="fas fa-minus")
                    div(v-else)
                      q-btn( size='xs' color='info' round dense @click='saveFranchiseTag(props.row)' icon="fas fa-tag")
                q-td(key='pos' :props='props' auto-width) {{ props.row.display_position }}
                q-td(key='playerName' :props='props')
                  .row.full-width
                    .col-2
                      q-avatar(size="25px")
                        img(:src="props.row.headshot.url" style="width: 85%")
                    .col-2.q-pl-xs.text-weight-bold.text-body2
                      | {{props.row.name.full}}
                      q-badge(v-if="checkTag(props.row.player_id)" color='white'): q-icon( name='fas fa-tag' color='info')
                q-td(key='team' :props='props')
                  .text-grey {{ props.row.editorial_team_full_name }}
                q-td(key='salary' :props='props')
                  .row(v-if="isFranchiseTagged(props.row.player_id)")
                    .col.text-grey.q-pr-sm Original: ${{getPlayerSalary(props.row.player_id)}}
                    .col.text-primary.text-weight-bolder.text-body2.q-pr-sm ${{displayTagAmount(props.row.player_id)}}
                  div(v-else)
                    .col(:style=" editSalaries ? 'border: 1px solid #26A69A;' : 'border: none;' ")
                      .text-primary.text-weight-bolder.text-body2.q-pr-sm ${{ getPlayerSalary(props.row.player_id) }}
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
        .col
          team-overview(v-if="loaded" :yahooTeamId="this.$route.params.team_id" :scadTeam="this.scadTeam" :yahooTeam="this.yahooTeam")
          draft-pick-overview(v-if="loaded" :yahooTeamId="this.$route.params.team_id" :scadTeam="this.scadTeam" :yahooTeam="this.yahooTeam")
</template>

<script>
import TeamOverview from '../components/TeamOverview'
import notify from '../utilities/nofity'
import DraftPickOverview from '../components/DraftPickOverview.vue'

export default {
  name: 'Team',
  components: {
    'team-overview': TeamOverview,
    'draft-pick-overview': DraftPickOverview
  },
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
          name: 'tag',
          required: true,
          label: '',
          align: 'center',
          field: row => row.display_position,
          format: val => `${val}`
          // sortable: true
          // classes: 'bg-secondary ellipsis',
          // style: 'width: 10px'
          // headerClasses: 'bg-grey-3'
        },
        {
          name: 'pos',
          required: true,
          label: 'Pos:',
          align: 'center',
          field: row => row.display_position,
          format: val => `${val}`
          // sortable: true
          // classes: 'bg-secondary ellipsis',
          // style: 'width: 10px'
          // headerClasses: 'bg-grey-3'
        },
        {
          name: 'playerName',
          required: true,
          label: 'Player:',
          align: 'left',
          sortable: false,
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
          name: 'salary',
          required: true,
          label: 'Salary:',
          align: 'right',
          // field: row => this.yahooTeam.team_key,
          // format: val => `${val}`,
          sortable: true
          // headerClasses: 'bg-grey-3',
          // // style: 'max-width: 100px'
        }
      ]
    }
  },
  created () {
    // console.log('[TEAM] - created()')
    this.getTeam(this.$route.params.team_id)
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    league () {
      return this.$store.state.league
    },
    team () {
      return this.$store.state.team
    },
    yahooTeams () {
      return this.league.yahooTeams
    },
    yahooLeagueId () {
      return this.league.yahooLeagueId
    },
    myYahooTeamId () {
      return this.$store.state.team.myYahooTeamId
    },
    yahooTeam () {
      return this.team.yahooTeam
    },
    players () {
      return this.yahooTeam.players
    },
    scadSettings () {
      return this.league.scadSettings
    },
    filteredTeams () {
      return this.yahooTeams.map(t => Object.assign({}, t, { value: t.name, label: t.name }))
    },
    teamSalaryCap () {
      return this.$store.state.league.scadSettings.teamSalaryCap
    },
    salaryCapExemptionLimit () {
      return this.$store.state.league.scadSettings.salaryCapExemptionLimit
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
    async getTeam (yahooTeamId) {
      // console.log(`[TEAM] - getTeam(${yahooTeamId})`)
      // Update team based on url param
      this.loaded = false
      await this.$store.dispatch('team/getTeam', { yahooLeagueId: this.yahooLeagueId, yahooTeamId: yahooTeamId })
      // await this.$store.dispatch('draftPicks/getDraftPicksByTeam', yahooTeamId)
      this.scadTeam = JSON.parse(JSON.stringify(this.$store.state.team.scadTeam))
      this.loaded = true
    },
    updateTeamPage (teamName) {
      console.log(`[TEAM] - updateTeamPage()`, this.selectedTeam.team_id)
      this.$router.push({ path: `/team/${this.selectedTeam.team_id}` })
      this.getTeam(this.selectedTeam.team_id)
    },
    saveSalaries () {
      console.log(`[TEAM] - saveSalaries()`)
      this.editSalaries = false
    },
    editingPlayer (yahooPlayer) {
      // eslint-disable-next-line eqeqeq
      this.editPlayer = this.scadTeam.players.find(p => p.yahooLeaguePlayerId == yahooPlayer.player_id)
      this.editPlayerInitSalary = this.editPlayer.salary
    },
    cancelEdit () {
      // eslint-disable-next-line eqeqeq
      let player = this.scadTeam.players.find(p => p.yahooLeaguePlayerId === this.editPlayer.yahooLeaguePlayerId)
      player.salary = this.editPlayerInitSalary
      this.editPlayer = {}
      this.editPlayerInitSalary = 0
    },
    async saveFranchiseTag (row) {
      console.log(`[TEAM] - saveFranchiseTag()`)
      // eslint-disable-next-line eqeqeq
      let player = this.scadTeam.players.find(p => p.yahooLeaguePlayerId == row.player_id)
      let initSalary = player.salary
      let salary = player.salary

      player.isFranchiseTag = true
      await this.$store.dispatch('team/savePlayer', { player: player, yahooTeamId: this.scadTeam.yahooLeagueTeamId })

      let franchiseTagDiscount = this.league.scadSettings.franchiseTagDiscount
      if (salary <= franchiseTagDiscount) {
        salary = 0
      } else {
        salary = (salary -= franchiseTagDiscount)
      }

      // Update SCAD-TEAM
      this.scadTeam.isFranchiseTag = true
      this.scadTeam.salary += (salary - initSalary)
      this.saveTeam()

      this.franchiseTag = false
    },
    async removeFranchiseTag (team) {
      console.log(`[TEAM] - removeFranchiseTag()`)
      // eslint-disable-next-line eqeqeq
      let player = this.scadTeam.players.find(p => p.yahooLeaguePlayerId == team.player_id)
      let salary = player.salary
      let adjustment = 0

      let franchiseTagDiscount = this.league.scadSettings.franchiseTagDiscount
      if (salary <= franchiseTagDiscount) {
        adjustment = salary
      } else {
        adjustment = franchiseTagDiscount
      }

      player.isFranchiseTag = false
      this.$store.dispatch('team/savePlayer', { player: player, yahooTeamId: this.scadTeam.yahooLeagueTeamId })

      // Update SCAD-TEAM
      this.scadTeam.isFranchiseTag = false
      this.scadTeam.salary += adjustment
      this.saveTeam()

      this.franchiseTag = false
    },
    async savePlayer () {
      let initTeamSalary = this.scadTeam.salary
      this.scadTeam.salary += (this.editPlayer.salary - this.editPlayerInitSalary)

      if (this.scadTeam.salary <= this.teamSalaryCap) {
        this.saveTeam()
        this.$store.dispatch('team/savePlayer', { player: this.editPlayer, yahooTeamId: this.scadTeam.yahooLeagueTeamId })
        this.editPlayer = {}
        this.editPlayerInitSalary = 0
      } else {
        this.scadTeam.salary = initTeamSalary
        notify.salaryLimit()
        this.cancelEdit()
      }
    },
    saveTeam () {
      var team = {
        id: this.scadTeam.id,
        yahooLeagueId: this.scadTeam.yahooLeagueId,
        salary: this.scadTeam.salary,
        isFranchiseTag: this.scadTeam.isFranchiseTag,
        exceptionIn: this.scadTeam.exceptionIn,
        exceptionOut: this.scadTeam.exceptionOut
      }
      this.$store.dispatch('team/saveTeam', team)
    },
    franchiseTagDisplay () {
      if (this.scadTeam.isFranchiseTag) {
        let scadPlayer = this.scadTeam.players.find(p => p.isFranchiseTag)
        // eslint-disable-next-line eqeqeq
        let yahooPlayer = this.players.find(p => p.player_id == scadPlayer.yahooLeaguePlayerId)
        return yahooPlayer.name.full
      } else {
        return '-'
      }
    },
    isFranchiseTagged (id) {
      // eslint-disable-next-line eqeqeq
      let scadPlayer = this.scadTeam.players.find(p => p.yahooLeaguePlayerId == id)
      if (scadPlayer.isFranchiseTag) { return true } else { return false }
    },
    getPlayerSalary (id) {
      // console.log('getPlayerSalary()')
      if (this.loaded) {
        // eslint-disable-next-line eqeqeq
        let player = this.scadTeam.players.find(p => p.yahooLeaguePlayerId == id)
        return player.salary
      }
    },
    displayTagAmount (id) {
      // console.log('getPlayerSalary()')
      if (this.loaded) {
        // eslint-disable-next-line eqeqeq
        let player = this.scadTeam.players.find(p => p.yahooLeaguePlayerId == id)
        let franchiseTagDiscount = this.league.scadSettings.franchiseTagDiscount
        let salary = player.salary

        if (salary <= franchiseTagDiscount) {
          return 0
        } else {
          return (salary -= franchiseTagDiscount)
        }
      }
    },
    checkTag (id) {
      // console.log('checkTag()')
      if (this.loaded) {
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

}
</script>

<style lang="sass">
a
  color: #8f0909
  text-decoration: none

.my-sticky-header-table
  thead
    background-color: #e1e2e3

</style>
