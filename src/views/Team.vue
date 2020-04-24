<template lang="pug">
  body
    .row.full-width(v-if="!loaded")
      .row.full-width.justify-center
        q-circular-progress.q-mt-xl(
          indeterminate
          size="90px"
          :thickness="0.2"
          color="primary"
          center-color="grey-5"
          track-color="transparent"
          class="q-ma-md"
          )
      .row.full-width.justify-center
        .text-grey Fetching SCAD team...
    .row.full-width.justify-center(v-else)
      .row.team-area.q-gutter-md.q-pa-md
        .col-3
          .col-4
            .row.justify-center
              q-avatar(size="100px")
                img( :src="yahooTeam.team_logos[0].team_logo.url")
            .row.justify-center
              .col
                .row.justify-center
                  .text-h6 {{yahooTeam.name}}
                .row.justify-center
                  .text-caption.text-grey-7 Manager ({{yahooTeam.managers[0].manager.nickname}})  | team_id: {{yahooTeam.team_id}}
                .row.justify-center
                  .text-caption: a(:href='yahooTeam.url') Yahoo Team Page
        q-separator(vertical)
        .col.q-pa-sm.q-pt-lg
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
                  //- | ${{scadTeam.salary}}
                  | ${{teamSalary}}
              .row
                .col-7.text-grey-8.text-caption.text-right Cap Exemption Give:
                .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
                  | ${{scadTeam.exceptionOut}}
              .row
                .col-7.text-grey-8.text-caption.text-right Cap Exemption Recieve:
                .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
                  | ${{scadTeam.exceptionIn}}
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
      .row.full-width.justify-center
        .row.team-area
          .row.team-table.justify-between.q-pl-lg
            q-select(square dense v-model='selectedTeam' :options="filteredTeams" style="width: 250px" @input="updateTeamPage")
            div.q-gutter-sm.q-pt-sm
              div
              q-btn(v-if="!franchiseTag && !editSalaries && scadSettings.franchiseTagSpots > 0" label='Franchise Tag' dense color='secondary' text-color='primary' size='sm' @click="franchiseTag = !franchiseTag")
              q-btn(v-if="franchiseTag && !editSalaries && scadSettings.franchiseTagSpots > 0" label='Cancel' dense color='primary' text-color='white' size='sm' @click="franchiseTag = false")
              q-btn(v-if="!editSalaries && !franchiseTag" label='Edit Salaries' dense color='secondary' text-color='primary' size='sm' @click="editSalaries = !editSalaries")
              q-btn(v-if="editSalaries && !franchiseTag" label='Done' dense color='primary' text-color='white' size='sm' @click="saveSalaries()")
          .row.q-pl-lg
            .q-py-md.team-table
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
                template(v-slot:header-cell-salary="props")
                  q-th(:props='props')
                    | {{ scadSettings.seasonYear }}
                template(v-slot:header-cell-previousSalary="props")
                  q-th(:props='props')
                    | {{ scadSettings.seasonYear - 1 }}
                template(v-slot:body='props')
                  q-tr(:props='props')
                    q-td(:class="bn(props.row.selected_position.position, 'edit')" auto-width)
                      div(v-if="franchiseTag")
                        div(v-if="scadTeam.isFranchiseTag")
                          q-btn(v-if="isFranchiseTagged(props.row.player_id)" size='xs' color='negative' round dense @click='removeFranchiseTag(props.row)' icon="fas fa-minus")
                        div(v-else)
                          q-btn( size='xs' color='info' round dense @click='saveFranchiseTag(props.row)' icon="fas fa-tag")
                    q-td(:class="bn(props.row.selected_position.position, 'pos')" key='pos' :props='props' auto-width)
                      | {{ props.row.selected_position.position }}
                    q-td(:class="bn(props.row.selected_position.position, 'playerName')" key='playerName' :props='props')
                      .row.full-width
                        .col-2
                          q-avatar(size="25px")
                            img(:src="props.row.headshot.url" style="width: 85%")
                        .col-2.q-pl-xs.text-body2.text-weight-bold
                          | {{props.row.name.full}}
                          q-badge(v-if="isFranchiseTagged(props.row.player_id)" color='white'): q-icon( name='fas fa-tag' color='info')
                    q-td(:class="bn(props.row.selected_position.position, 'team')" key='team' :props='props')
                      | {{ props.row.editorial_team_full_name }}
                    q-td(:class="bn(props.row.selected_position.position, 'previousSalary')" key='previousSalary' :props='props' auto-width)
                      .text-body2.q-pr-sm ${{ getPlayerPrevSalary(props.row.player_id) }}
                    q-td(:class="bn(props.row.selected_position.position, 'originalSalary')" key='originalSalary' :props='props' auto-width)
                      .row(v-if="isFranchiseTagged(props.row.player_id) || isIR(props.row.selected_position.position)")
                        .col.text-grey.q-pr-sm Original: ${{getOriginalSalary(props.row.player_id)}}
                    q-td(:class="bn(props.row.selected_position.position, 'salary')" key='salary' :props='props' auto-width)
                      .col(:style=" (editSalaries && !isFranchiseTagged(props.row.player_id)) ? 'border: 1px solid #26A69A;' : 'border: none;' ")
                        .text-weight-bolder.text-body2.q-pr-sm ${{ getPlayerSalary(props.row.player_id, props.row.selected_position.position) }}
                      q-popup-edit(
                        v-if="editSalaries && !isFranchiseTagged(props.row.player_id)"
                        :cover="false"
                        color="primary"
                        title='Update Salary'
                        v-model.number='editPlayer.salary'
                        buttons
                        label-set="Save"
                        :validate="editPlayerValidation"
                        @before-show="editingPlayer(props.row)"
                        @save="savePlayer"
                        @cancel="cancelEdit()"
                        )
                        q-input(
                          type='number'
                          v-model='editPlayer.salary'
                          :error="error"
                          :error-message="errorMessage"
                          dense
                          autofocus
                          )
            .div
              team-overview(v-if="loaded" :yahooTeamId="this.$route.params.team_id" :scadTeam="this.scadTeam" :yahooTeam="this.yahooTeam")
              draft-pick-overview(v-if="loaded" :yahooTeamId="this.$route.params.team_id" :scadTeam="this.scadTeam" :yahooTeam="this.yahooTeam")
              cap-exemption-overview(v-if="loaded" :yahooTeamId="this.$route.params.team_id" :scadTeam="this.scadTeam" :yahooTeam="this.yahooTeam")

</template>

<script>
import TeamOverview from '../components/TeamOverview'
import notify from '../utilities/nofity'
import DraftPickOverview from '../components/DraftPickOverview.vue'
import CapExemptionOverview from '../components/CapExemptionOverview.vue'
/* eslint-disable eqeqeq */

export default {
  name: 'Team',
  components: {
    'team-overview': TeamOverview,
    'draft-pick-overview': DraftPickOverview,
    'cap-exemption-overview': CapExemptionOverview
  },
  data () {
    return {
      teamSalary: 0,
      loaded: false,
      error: false,
      errorMessage: '',
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
          field: row => row.selected_position.position
        },
        {
          name: 'pos',
          required: true,
          label: 'Pos:',
          align: 'left'
        },
        {
          name: 'playerName',
          required: true,
          label: 'Player:',
          align: 'left',
          sortable: false
        },
        {
          name: 'team',
          required: true,
          label: 'Team:',
          align: 'left',
          sortable: false
        },
        {
          name: 'previousSalary',
          required: true,
          label: 'Salary:',
          align: 'left',
          sortable: false
        },
        {
          name: 'originalSalary',
          required: true,
          label: '',
          align: 'left',
          sortable: false
        },
        {
          name: 'salary',
          required: true,
          label: `Salary:`,
          align: 'left',
          sortable: false
        }
      ]
    }
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
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.yahooTeam.players.sort(function (a, b) {
        if (b.selected_position.position === 'BN') {
          if (a.selected_position.position === 'DEF' ||
              a.selected_position.position === 'K') {
            return -1
          }
        } else {
          return 1
        }
      })
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
    capExemptionsByTeam () {
      return this.$store.state.capExemptions.capExemptionsByTeam
    }
  },
  async created () {
    // console.log('[TEAM] - mounted()')
    this.$store.dispatch('league/getYahooSettings', this.yahooLeagueId)
    this.getTeam(this.$route.params.team_id)
  },
  methods: {
    async getTeam (yahooTeamId) {
      // console.log(`[TEAM] - getTeam(${yahooTeamId})`)
      // Update team based on url param
      this.loaded = false
      await this.$store.dispatch('team/getTeam', { yahooLeagueId: this.yahooLeagueId, yahooTeamId: yahooTeamId })
      await this.getExemptions()
      await this.updateTeamSalary()
      this.scadTeam = JSON.parse(JSON.stringify(this.$store.state.team.scadTeam))
      this.loaded = true
    },
    updateTeamPage (teamName) {
      console.log(`[TEAM] - updateTeamPage()`, this.selectedTeam.team_id)
      this.$router.push({ path: `/team/${this.selectedTeam.team_id}` })
      this.getTeam(this.selectedTeam.team_id)
    },
    getExemptions () {
      this.$store.dispatch('capExemptions/getCapExemptionsByTeam', { teamId: this.$route.params.team_id, year: this.scadSettings.seasonYear })
    },
    updateTeamSalary () {
      if (this.loaded) {
        let salary = 0
        this.players.forEach(p => {
          salary += this.getPlayerSalary(p.player_id, p.selected_position.position)
        })
        if (this.capExemptionsByTeam) {
          this.capExemptionsByTeam.foreach(ce => {
            if (ce.yahooTeamGive.team_id === this.yahooTeam.team_id) {
              salary -= ce.amount
            } else { salary += ce.amount }
          })
        }
        this.teamSalary = salary
      }
    },
    getPlayerSalary (id, pos) {
      // console.log('getPlayerSalary()')
      if (this.loaded) {
        let player = this.scadTeam.players.find(p => p.yahooLeaguePlayerId == id)
        let salary = player.salary
        if (player.isFranchiseTag) {
          return this.getFranchiseTagSalary(salary)
        } else if (pos === 'IR') {
          console.log(id, pos)
          return this.getIrSalary(salary)
        } else {
          return player.salary
        }
      }
    },
    getFranchiseTagSalary (salary) {
      let franchiseTagDiscount = this.league.scadSettings.franchiseTagDiscount
      if (salary <= franchiseTagDiscount) {
        return 0
      } else {
        return (salary -= franchiseTagDiscount)
      }
    },
    getIrSalary (salary) {
      let irReliefPerc = this.league.scadSettings.irReliefPerc / 100
      salary = salary * irReliefPerc
      return salary
    },
    bn (pos, col) {
      return {
        'text-primary': col === 'salary',
        'text-grey': col === 'previousSalary' || col === 'team',
        'text-weight-bold': col === 'pos' || col === 'playerName',
        'text-red': pos === 'IR',
        'bg-grey-3': pos === 'BN',
        'bg-red-1': pos === 'IR'
      }
    },
    saveSalaries () {
      // console.log(`[TEAM] - saveSalaries()`)
      this.editSalaries = false
    },
    editingPlayer (yahooPlayer) {
      this.editPlayer = this.scadTeam.players.find(p => p.yahooLeaguePlayerId == yahooPlayer.player_id)
      this.editPlayerInitSalary = this.editPlayer.salary
    },
    editPlayerValidation (val) {
      if (val < 0 || val === '') {
        this.error = true
        this.errorMessage = 'Value must be positive'
        return false
      }
      this.error = false
      this.errorMessage = ''
      return true
    },
    cancelEdit () {
      let player = this.scadTeam.players.find(p => p.yahooLeaguePlayerId === this.editPlayer.yahooLeaguePlayerId)
      player.salary = this.editPlayerInitSalary
      this.editPlayer = {}
      this.editPlayerInitSalary = 0
      this.error = false
      this.errorMessage = ''
    },
    async saveFranchiseTag (row) {
      console.log(`[TEAM] - saveFranchiseTag()`)

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
      this.updateTeamSalary()
    },
    async saveTeam () {
      var team = {
        id: this.scadTeam.id,
        yahooLeagueId: this.scadTeam.yahooLeagueId,
        salary: this.scadTeam.salary,
        isFranchiseTag: this.scadTeam.isFranchiseTag,
        exceptionIn: this.scadTeam.exceptionIn,
        exceptionOut: this.scadTeam.exceptionOut
      }
      await this.$store.dispatch('team/saveTeam', team)
      await this.$store.dispatch('league/getScadTeams', this.league.scadLeagueId)
      await this.$store.dispatch('team/getTeam', { yahooLeagueId: this.scadTeam.yahooLeagueId, yahooTeamId: this.scadTeam.yahooLeagueTeamId })
    },
    franchiseTagDisplay () {
      if (this.scadTeam.isFranchiseTag && this.loaded) {
        let scadPlayer = this.scadTeam.players.find(p => p.isFranchiseTag)

        let yahooPlayer = this.players.find(p => p.player_id == scadPlayer.yahooLeaguePlayerId)
        return yahooPlayer.name.full
      } else {
        return '-'
      }
    },
    isFranchiseTagged (id) {
      let scadPlayer = this.scadTeam.players.find(p => p.yahooLeaguePlayerId == id)
      if (scadPlayer.isFranchiseTag) { return true } else { return false }
    },
    isIR (pos) {
      if (pos === 'IR') { return true } else { return false }
    },
    getPlayerPrevSalary (id) {
      // console.log('getPlayerSalary()')
      if (this.loaded) {
        let player = this.scadTeam.players.find(p => p.yahooLeaguePlayerId == id)
        return player.previousYearSalary
      }
    },
    getOriginalSalary (id) {
      if (this.loaded) {
        let player = this.scadTeam.players.find(p => p.yahooLeaguePlayerId == id)
        return player.salary
      }
    },
    checkTag (id) {
      // console.log('checkTag()')
      if (this.loaded) {
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
.bn
  background-color: #e1e2e3
.team-area
  width: 1100px
.team-table
  width: 700px
.my-sticky-header-table
  thead
    background-color: #e1e2e3

</style>
