<template lang="pug">
  body
    loading(v-if="!loaded" :message="'Fetching SCAD team...'")
    .row.full-width.justify-center(v-else)
      .row.team-area.q-gutter-md.q-pa-md.justify-center
        .col-3
          .col-4
            .row.justify-center
              q-avatar(size="100px")
                img( :src="yahooTeam.team_logos[0].url")
            .row.justify-center
              .col
                .row.justify-center
                  .text-h6 {{yahooTeam.name}}
                .row.justify-center.gt-sm
                  .text-caption.text-grey-7 Manager ({{yahooTeam.managers[0].nickname}})  | team_id: {{yahooTeam.team_id}}
                .row.justify-center.gt-sm
                  .text-caption: a(:href='yahooTeam.url') Yahoo! Team Page
        q-separator.gt-sm(vertical)
        .row.lt-md
          .row.full-width.justify-center
            .col-7.text-grey-8.text-caption.text-right Cap Exemption Give:
            .col.text-negative.text-weight-bold.text-body-1
              | ${{scadTeam.exceptionOut}}
          .row.full-width.justify-center
            .col-7.text-grey-8.text-caption.text-right Cap Exemption Recieve:
            .col.text-positive.text-weight-bold.text-body-1
              | ${{scadTeam.exceptionIn}}
          .row.full-width.justify-center
            .col-7.text-grey-8.text-caption.text-right Franchise Tag:
            .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
              span(v-if="scadSettings.franchiseTagSpots > 0") {{franchiseTagDisplay()}}
              span(v-else) N/A
          .row.full-width.justify-center
            .col-7.text-grey-6.text-weight-bold.text-subtitle1.text-right Current Team Salary:
            .col.text-primary.text-weight-bold.text-subtitle1.q-pl-sm
              | ${{teamSalary}}
        .col.q-pa-sm.q-pt-lg.gt-sm
          .row.q-gutter-xs
            .col
              .text-primary.text-center.text-weight-bolder.text-subtitle1
                | SCAD Details
              .row
                .col-7.text-grey-8.text-caption.text-right Salary Cap Limit:
                .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
                  | ${{teamSalaryCap}}
              .row
                .col-7.text-grey-8.text-caption.text-right Cap Exemption Give:
                .text-negative.text-weight-bold.text-body-1.q-pl-sm
                  | ${{scadTeam.exceptionOut}}
              .row
                .col-7.text-grey-8.text-caption.text-right Cap Exemption Recieve:
                .text-positive.text-weight-bold.text-body-1.q-pl-sm
                  | ${{scadTeam.exceptionIn}}
              .row
                .col-7.text-grey-8.text-caption.text-right Franchise Tag:
                .col.text-primary.text-weight-bold.text-body-1.q-pl-sm
                  span(v-if="scadSettings.franchiseTagSpots > 0") {{franchiseTagDisplay()}}
                  span(v-else) N/A
              .row
                .col-7.text-grey-6.text-weight-bold.text-subtitle1.text-right.q-pt-sm Current Team Salary:
                .col.text-primary.text-weight-bold.text-subtitle1.q-pl-sm.q-pt-sm
                  | ${{teamSalary}}

            q-separator(vertical)

            .col
              .text-primary.text-center.text-weight-bolder.text-subtitle1
                | Yahoo! Details
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
        .row.full-width.justify-center
          .col-xl-8.col-lg-8.col-md-8.col-sm-12.col-xs-12.q-px-xs
            .row.justify-between.align-center.q-px-sm
              q-select(square dense v-model='selectedTeam' :options="filteredTeams" style="width: 300px" @input="updateTeamPage")
              q-toggle.q-pt-sm(v-model="viewByTeam", label="View By Position")
              div.q-gutter-sm.q-pt-sm
                div
                q-btn(v-if="!franchiseTag && !editSalaries && !preseasonIR && checkPreseason()" label='PreseasonIR' dense color='secondary' text-color='primary' size='sm' @click="preseasonIR = true")
                q-btn(v-if="!franchiseTag && !editSalaries && preseasonIR && checkPreseason()" label='Cancel' dense color='primary' text-color='white' size='sm' @click="preseasonIR = false")
                q-btn(v-if="!franchiseTag && !editSalaries && !preseasonIR && scadSettings.franchiseTagSpots > 0" label='Franchise Tag' dense color='secondary' text-color='primary' size='sm' @click="franchiseTag = !franchiseTag")
                q-btn(v-if="franchiseTag && !editSalaries && !preseasonIR && scadSettings.franchiseTagSpots > 0" label='Cancel' dense color='primary' text-color='white' size='sm' @click="franchiseTag = false")
                q-btn(v-if="!editSalaries && !franchiseTag && !preseasonIR && checkIfCommish(this.league.yahooLeagueId, this.league.yahooCommishLeagues)" label='Edit Salaries' dense color='secondary' text-color='primary' size='sm' @click="editSalaries = !editSalaries")
                q-btn(v-if="editSalaries && !franchiseTag && !preseasonIR && checkIfCommish(this.league.yahooLeagueId, this.league.yahooCommishLeagues)" label='Done' dense color='primary' text-color='white' size='sm' @click="saveSalaries()")
            .col.full-width
              .q-py-md
                q-table(
                  class="my-sticky-header-table"
                  v-if="loaded"
                  :data='viewByTeam ? playersByPos : players',
                  :columns='windowWidth > 700 ? columns : columnsMobile',
                  row-key= 'player_key',
                  :pagination.sync="pagination",
                  hide-bottom,
                  dense,
                  flat,
                  square
                  )
                  template(v-slot:header-cell-salary="props")
                    q-th(:props='props')
                      | {{ scadSettings.seasonYear }}
                  template(v-slot:header-cell-previousSalary="props")
                    q-th(:props='props')
                      | {{ scadSettings.seasonYear - 1 }}
                  template(v-slot:body='props')
                    q-tr(:props='props')
                      q-td(:class="fmt(props.row, 'edit', viewByTeam)" auto-width)
                        div(v-if="franchiseTag")
                          div(v-if="scadTeam.isFranchiseTag")
                            q-btn( v-if="isFranchiseTagged(props.row.player_id)" size='xs' color='negative' round dense @click='removeFranchiseTag(props.row)' icon="fas fa-minus")
                          div(v-else)
                            q-btn( size='xs' color='info' round dense @click='saveFranchiseTag(props.row)' icon="fas fa-tag")
                        div(v-if="preseasonIR")
                          div
                            q-btn( v-if="!checkPreseasonIR() && props.row.selected_position === 'IR'", size='xs' color='accent' round dense @click='savePreseasonIR(props.row.player_id)' icon="fas fa-crutch")
                            q-btn( v-if="checkPreseasonIR() && props.row.selected_position === 'IR'", size='xs' color='accent' round dense @click='removePreseasonIR(props.row.player_id)' icon="fas fa-minus")
                      q-td(:class="fmt(props.row, 'pos', viewByTeam)" key='pos' :props='props' auto-width)
                        .text-body(v-if="viewByTeam") {{ props.row.display_position }}
                        .text-body(v-else) {{ props.row.selected_position }}
                      q-td(:class="fmt(props.row, 'playerName', viewByTeam)" key='playerName' :props='props')
                        .row.full-width
                          .col-1
                            q-avatar(size="25px")
                              img(:src="props.row.headshot.url" style="width: 85%")
                          .col.q-pl-sm.text-body2
                            .row.full-width
                              .text-weight-bold {{props.row.name.full}}
                              .text-caption.q-pl-sm(v-if="checkPlayerStatus(props.row.selected_position)") {{ props.row.status }}
                              .text-grey.text-caption.q-pl-sm ({{props.row.display_position}})
                              q-icon.q-pa-xs(v-if="isFranchiseTagged(props.row.player_id)" name='fas fa-tag' color='info')
                      q-td(:class="fmt(props.row, 'team', viewByTeam)" key='team' :props='props')
                        | {{ props.row.editorial_team_full_name }}
                      q-td(:class="fmt(props.row, 'salaryHistory', viewByTeam)" key='salaryHistory' :props='props' auto-width)
                        q-icon(name="history" color="info" size="xs" @click="playerHistoryDialog(props.row)")
                          q-tooltip View {{props.row.name.full}}'s salary history
                      q-td(:class="fmt(props.row, 'previousSalary', viewByTeam)" key='previousSalary' :props='props' auto-width)
                        .text-body2.q-pr-sm ${{ getPlayerPrevSalary(props.row.player_id) }}
                      q-td(:class="fmt(props.row, 'originalSalary', viewByTeam)" key='originalSalary' :props='props' auto-width)
                        .row(v-if="isFranchiseTagged(props.row.player_id) || isIR(props.row.selected_position)")
                          .col.text-grey.q-pr-sm (${{getOriginalSalary(props.row.player_id)}})
                      q-td(:class="fmt(props.row, 'salary', viewByTeam)" key='salary' :props='props' auto-width)
                        .col(v-if="(isScadPlayer(props.row.player_id, scadTeam))" :style=" (editSalaries && !isFranchiseTagged(props.row.player_id)) ? 'border: 1px solid #26A69A;' : 'border: none;' ")
                          .text-weight-bolder.text-body2.q-pr-sm ${{ getPlayerSalary(props.row.player_id, props.row.selected_position) }}
                        .col(v-else)
                          q-btn(size='xs' color='positive' round dense @click='addScadPlayer(props.row.player_id)' icon="fas fa-plus")
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
          .col-xl-4.col-lg-4.col-md-4.col-sm-12.col-xs-12.q-px-xs
            team-overview(v-if="loaded" :yahooTeamId="this.$route.params.team_id" :scadTeam="this.scadTeam" :yahooTeam="this.yahooTeam")
            draft-pick-overview(v-if="loaded" :yahooTeamId="this.$route.params.team_id" :scadTeam="this.scadTeam" :yahooTeam="this.yahooTeam")
            cap-exemption-overview(v-if="loaded" :yahooTeamId="this.$route.params.team_id" :scadTeam="this.scadTeam" :yahooTeam="this.yahooTeam" @updateTeam="getTeam($route.params.team_id)")
      player-history-dialog(v-if="playerHistory" :yahooPlayer="playerHistoryPlayer")
</template>

<script>
import TeamOverview from '../components/TeamOverview'
import PlayerHistoryDialog from '../components/dialogs/playerHistoryDialog'
import notify from '../utilities/nofity'
import DraftPickOverview from '../components/DraftPickOverview.vue'
import CapExemptionOverview from '../components/CapExemptionOverview.vue'
import { calcTeamSalary, calcPlayerSalary } from '../utilities/calculator'
import { getScadPlayer,
  isFranchiseTagged,
  getPlayerPrevSalary,
  getOriginalSalary,
  isPreseasonIR
  , getTeamGuid } from '../utilities/functions'
import { isIR, isScadPlayer, checkIfCommish } from '../utilities/validators'
import { fmt } from '../utilities/formatters'

import moment from 'moment'
import Loading from '../components/Loading'

/* eslint-disable eqeqeq */

export default {
  name: 'Team',
  components: {
    'team-overview': TeamOverview,
    'draft-pick-overview': DraftPickOverview,
    'cap-exemption-overview': CapExemptionOverview,
    'loading': Loading,
    'player-history-dialog': PlayerHistoryDialog
  },
  data () {
    return {
      viewByTeam: true,
      teamSalary: 0,
      loaded: false,
      error: false,
      errorMessage: '',
      scadTeam: {},
      editPlayer: {},
      editPlayerInitSalary: 0,
      playerHistoryPlayer: {},
      selectedTeam: 'Choose a Team',
      editSalaries: false,
      franchiseTag: false,
      preseasonIR: false,
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
          field: row => row.selected_position
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
          name: 'salaryHistory',
          label: '',
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
      ],
      columnsMobile: [
        {
          name: 'tag',
          required: true,
          label: '',
          align: 'center',
          field: row => row.selected_position
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
    checkIfCommish () { return checkIfCommish },
    isIR () {
      return isIR
    },
    fmt () {
      return fmt
    },
    isScadPlayer () {
      return isScadPlayer
    },
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
      return this.yahooTeam.roster.sort(function (a, b) {
        if (b.selected_position === 'QB') return 1
        else if (b.selected_position === 'WR') {
          if (a.selected_position === 'QB') return -1
        } else if (b.selected_position === 'RB') {
          if (a.selected_position === 'QB') return -1
          if (a.selected_position === 'WR') return -1
        } else if (b.selected_position === 'TE') {
          if (a.selected_position === 'QB') return -1
          if (a.selected_position === 'WR') return -1
          if (a.selected_position === 'RB') return -1
        } else if (b.selected_position === 'W/R/T') {
          if (a.selected_position === 'QB') return -1
          if (a.selected_position === 'WR') return -1
          if (a.selected_position === 'RB') return -1
          if (a.selected_position === 'TE') return -1
        } else if (b.selected_position === 'DEF') {
          if (a.selected_position === 'QB') return -1
          if (a.selected_position === 'WR') return -1
          if (a.selected_position === 'RB') return -1
          if (a.selected_position === 'TE') return -1
          if (a.selected_position === 'W/R/T') return -1
        } else if (b.selected_position === 'BN') {
          if (a.selected_position === 'QB') return -1
          if (a.selected_position === 'WR') return -1
          if (a.selected_position === 'RB') return -1
          if (a.selected_position === 'TE') return -1
          if (a.selected_position === 'W/R/T') return -1
          if (a.selected_position === 'DEF') return -1
        } else return -1
      })
    },
    playersByPos () {
      let scadTeamRoster = this.scadTeam.roster
      let franchiseTagDiscount = this.franchiseTagDiscount
      let irReliefPerc = this.irReliefPerc
      let yahooTeam = this.yahooTeam
      function getPlayerSalary (id, pos) {
        let salary = calcPlayerSalary(
          id,
          pos,
          scadTeamRoster,
          franchiseTagDiscount,
          irReliefPerc,
          yahooTeam
        )
        return salary
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.yahooTeam.roster.sort(function (a, b) {
        if (b.display_position === 'QB') {
          if (a.display_position === 'QB' && getPlayerSalary(b.player_id, b.selected_position) < getPlayerSalary(a.player_id, a.selected_position)) { return -1 }
        } else if (b.display_position === 'WR') {
          if (a.display_position === 'QB') return -1
          else if (a.display_position === 'WR' && getPlayerSalary(b.player_id, b.selected_position) < getPlayerSalary(a.player_id, a.selected_position)) { return -1 }
        } else if (b.display_position === 'RB') {
          if (a.display_position === 'QB') return -1
          if (a.display_position === 'WR') return -1
          else if (a.display_position === 'RB' && getPlayerSalary(b.player_id, b.selected_position) < getPlayerSalary(a.player_id, a.selected_position)) { return -1 }
        } else if (b.display_position === 'TE') {
          if (a.display_position === 'QB') return -1
          if (a.display_position === 'WR') return -1
          if (a.display_position === 'RB') return -1
          else if (a.display_position === 'TE' && getPlayerSalary(b.player_id, b.selected_position) < getPlayerSalary(a.player_id, a.selected_position)) { return -1 }
        } else return -1
      })
    },
    scadSettings () {
      return this.league.scadSettings
    },
    filteredTeams () {
      return this.yahooTeams.map(t =>
        Object.assign({}, t, { value: t.name, label: t.name })
      )
    },
    teamSalaryCap () {
      return this.$store.state.league.scadSettings.teamSalaryCap
    },
    salaryCapExemptionLimit () {
      return this.$store.state.league.scadSettings.salaryCapExemptionLimit
    },
    capExemptionsByTeam () {
      return this.$store.state.capExemptions.capExemptionsByTeam
    },
    franchiseTagDiscount () {
      return this.league.scadSettings.franchiseTagDiscount
    },
    irReliefPerc () {
      return this.league.scadSettings.irReliefPerc
    },
    playerHistory () { return this.$store.state.dialog.playerHistory }
  },
  async created () {
    // console.log('[TEAM] - mounted()')
    await this.$store.dispatch('league/getYahooSettings', this.yahooLeagueId)
    await this.getTeam(this.$route.params.team_id)
    await this.updatePreseasonIR()
  },
  beforeRouteUpdate (to, from, next) {
    this.selectedTeam = 'Choose a Team'
    this.getTeam(to.params.team_id)
    next()
  },
  methods: {
    async getTeam (yahooTeamId) {
      // console.log(`[TEAM] - getTeam(${yahooTeamId})`)
      // Update team based on url param
      this.loaded = false
      if (yahooTeamId === this.team.myYahooTeamId) {
        this.$store.commit('team/updateYahooTeam', this.team.myYahooTeam)
        this.$store.commit('team/updateScadTeam', this.team.myScadTeam)
      } else {
        await this.$store.dispatch('team/getTeam', {
          yahooLeagueId: this.yahooLeagueId,
          yahooTeamId: yahooTeamId
        })
      }
      await this.$store.dispatch('capExemptions/getCapExemptionsByTeam', {
        guid: this.yahooTeam.managers[0].guid
      })
      this.scadTeam = JSON.parse(
        JSON.stringify(this.$store.state.team.scadTeam)
      )
      this.updateTeamSalary()
      this.loaded = true
    },
    updateTeamPage (teamName) {
      console.log(`[TEAM] - updateTeamPage()`, this.selectedTeam.team_id)
      this.$router.push({ path: `/team/${this.selectedTeam.team_id}` })
    },
    updateTeamSalary () {
      this.teamSalary = calcTeamSalary(
        this.yahooTeam.roster,
        this.scadTeam.roster,
        this.capExemptionsByTeam,
        this.franchiseTagDiscount,
        this.irReliefPerc,
        this.yahooTeam,
        this.scadSettings.seasonYear
      )
    },
    getPlayerSalary (id, pos) {
      return calcPlayerSalary(
        id,
        pos,
        this.scadTeam.roster,
        this.franchiseTagDiscount,
        this.irReliefPerc,
        this.yahooTeam
      )
    },
    checkPlayerStatus (position) {
      if (position === 'IR') {
        return true
      }
    },
    async saveSalaries () {
      console.log('saveSalaries')
      await this.getTeam(this.$route.params.team_id)
      this.updateTeamSalary()
      await this.saveTeam()
      this.editSalaries = false
    },
    editingPlayer (yahooPlayer) {
      this.editPlayer = getScadPlayer(
        this.scadTeam.roster,
        yahooPlayer.player_id
      )
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
      let player = this.scadTeam.roster.find(
        p => p.yahooPlayerId === this.editPlayer.yahooPlayerId
      )
      player.salary = this.editPlayerInitSalary
      this.editPlayer = {}
      this.editPlayerInitSalary = 0
      this.error = false
      this.errorMessage = ''
    },
    checkPreseason () {
      // if (moment().isBefore(moment(new Date(this.league.yahooLeagueDetails.start_date)))) return true
      if (moment().isBefore(moment(new Date('2020-09-09')))) return true
      else return false
    },
    async savePreseasonIR (id) {
      console.log(`[TEAM] - savePreseasonIR()`, id)

      if (this.checkPreseason()) {
        let player = getScadPlayer(this.scadTeam.roster, id)
        player.preseasonIR = true
        await this.$store.dispatch('team/savePlayer', {
          player: player,
          log: undefined,
          yahooTeamId: this.scadTeam.yahooTeamId
        })
      }
      // Update SCAD-TEAM
      this.updateTeamSalary()
      await this.saveTeam()
      this.preseasonIR = false
    },

    async removePreseasonIR (id) {
      console.log(`[TEAM] - removePreseasonIR()`, id)

      let player = getScadPlayer(this.scadTeam.roster, id)
      player.preseasonIR = false
      await this.$store.dispatch('team/savePlayer', {
        player: player,
        log: undefined,
        yahooTeamId: this.scadTeam.yahooTeamId
      })
      // Update SCAD-TEAM
      this.updateTeamSalary()
      await this.saveTeam()
      this.preseasonIR = false
    },

    checkPreseasonIR () {
      let preseasonIRPlayer = this.scadTeam.roster.find(p => p.preseasonIR)
      if (preseasonIRPlayer) return true
      else return false
    },

    async updatePreseasonIR () {
      let preseasonIRPlayer = this.scadTeam.roster.find(p => p.preseasonIR)
      if (preseasonIRPlayer) {
        let yahooPlayer = this.yahooTeam.roster.find(p => p.player_id == preseasonIRPlayer.yahooPlayerId)
        if (yahooPlayer.selected_position !== 'IR') {
          preseasonIRPlayer.preseasonIR = false
          await this.$store.dispatch('team/savePlayer', {
            player: preseasonIRPlayer,
            log: undefined,
            yahooTeamId: this.scadTeam.yahooTeamId
          })
          // Update SCAD-TEAM
          this.updateTeamSalary()
          await this.saveTeam()
        }
      }
    },

    async saveFranchiseTag (yahooPlayer) {
      console.log(`[TEAM] - saveFranchiseTag()`)

      let player = getScadPlayer(this.scadTeam.roster, yahooPlayer.player_id)
      let initSalary = player.salary
      let salary = player.salary

      player.isFranchiseTag = true

      let franchiseTagDiscount = this.league.scadSettings.franchiseTagDiscount
      if (salary <= franchiseTagDiscount) {
        salary = 0
      } else {
        salary = salary -= franchiseTagDiscount
      }

      const log = {
        originalSalary: initSalary,
        newSalary: salary,
        type: 'Manual',
        team: {
          name: this.team.yahooTeam.name,
          yahooTeamId: this.team.yahooTeam.team_id,
          yahooGuid: getTeamGuid(this.team.yahooTeam)
        },
        user: this.user.user.name,
        comment: 'Adding Franchise Tag',
        date: moment().format()
      }
      await this.$store.dispatch('team/savePlayer', {
        player: player,
        log: log,
        yahooTeamId: this.scadTeam.yahooTeamId
      })

      // Update SCAD-TEAM
      this.scadTeam.isFranchiseTag = true
      this.scadTeam.salary += salary - initSalary
      this.updateTeamSalary()
      await this.saveTeam()

      this.franchiseTag = false
    },
    async removeFranchiseTag (yahooPlayer) {
      console.log(`[TEAM] - removeFranchiseTag()`)

      let player = getScadPlayer(this.scadTeam.roster, yahooPlayer.player_id)
      let salary = player.salary
      let adjustment = 0

      let franchiseTagDiscount = this.league.scadSettings.franchiseTagDiscount
      if (salary <= franchiseTagDiscount) {
        adjustment = salary
      } else {
        adjustment = franchiseTagDiscount
      }

      player.isFranchiseTag = false
      const log = {
        originalSalary: salary -= adjustment,
        newSalary: player.salary,
        type: 'Manual',
        team: {
          name: this.team.yahooTeam.name,
          yahooTeamId: this.team.yahooTeam.team_id,
          yahooGuid: getTeamGuid(this.team.yahooTeam)
        },
        user: this.user.user.name,
        comment: 'Removing Franchise Tag',
        date: moment().format()
      }
      await this.$store.dispatch('team/savePlayer', {
        player: player,
        log: log,
        yahooTeamId: this.scadTeam.yahooTeamId
      })

      // Update SCAD-TEAM
      this.scadTeam.isFranchiseTag = false
      this.scadTeam.salary += adjustment
      this.updateTeamSalary()
      await this.saveTeam()

      this.franchiseTag = false
    },
    async savePlayer () {
      const log = {
        originalSalary: this.editPlayerInitSalary,
        newSalary: parseInt(this.editPlayer.salary),
        type: 'Manual',
        team: {
          name: this.team.yahooTeam.name,
          yahooTeamId: this.team.yahooTeam.team_id,
          yahooGuid: getTeamGuid(this.team.yahooTeam)
        },
        user: this.user.user.name,
        comment: `Manual salary adjustment`,
        date: moment().format()
      }
      await this.$store.dispatch('team/savePlayer', {
        player: this.editPlayer,
        log: log,
        yahooTeamId: this.scadTeam.yahooTeamId
      })
      // console.log('**DONE SAVING PLAYER**')
      this.editPlayer = {}
      this.editPlayerInitSalary = 0
      if (this.scadTeam.salary > this.teamSalaryCap) {
        notify.salaryLimit()
      }
    },
    async saveTeam () {
      var team = {
        _id: this.scadTeam._id,
        yahooLeagueId: this.scadTeam.yahooLeagueId,
        salary: this.teamSalary,
        isFranchiseTag: this.scadTeam.isFranchiseTag,
        exceptionIn: this.scadTeam.exceptionIn,
        exceptionOut: this.scadTeam.exceptionOut
      }
      await this.$store.dispatch('team/saveTeam', team)
      await this.$store.dispatch(
        'league/getScadTeams',
        this.league.scadLeagueId
      )
      await this.$store.dispatch('team/getTeam', {
        yahooLeagueId: this.scadTeam.yahooLeagueId,
        yahooTeamId: this.scadTeam.yahooTeamId
      })
    },
    franchiseTagDisplay () {
      let scadPlayer
      let yahooPlayer
      if (this.scadTeam.isFranchiseTag && this.loaded) {
        scadPlayer = this.scadTeam.roster.find(p => p.isFranchiseTag)
        if (scadPlayer) {
          yahooPlayer = this.yahooTeam.roster.find(
            p => p.player_id == scadPlayer.yahooPlayerId
          )
          return yahooPlayer.name.full
        } else {
          this.scadTeam.isFranchiseTag = false
          this.saveTeam()
          return '-'
        }
      } else {
        return '-'
      }
    },
    isFranchiseTagged (id) {
      return isFranchiseTagged(id, this.scadTeam)
    },
    isPreseasonIR (id) {
      return isPreseasonIR(id, this.scadTeam)
    },
    getPlayerPrevSalary (id) {
      if (this.loaded) {
        return getPlayerPrevSalary(id, this.scadTeam)
      }
    },
    getOriginalSalary (id) {
      if (this.loaded) {
        return getOriginalSalary(id, this.scadTeam)
      }
    },
    async addScadPlayer (id) {
      let player = {
        yahooPlayerId: id,
        yahooLeagueId: this.scadTeam.yahooLeagueId,
        scadLeagueId: this.scadTeam.scadLeagueId,
        yahooTeamId: this.scadTeam.yahooTeamId,
        scadTeamId: this.scadTeam._id,
        salary: 0,
        isFranchiseTag: false,
        renewSCADLeaguePlayerId: 0,
        previousYearSalary: 0
      }
      await this.$store.dispatch('team/addPlayer', { player: player })
      await this.getTeam(this.scadTeam.yahooTeamId)
    },
    playerHistoryDialog (player) {
      this.playerHistoryPlayer = player
      // console.log(this.playerHistoryPlayer)
      this.$store.commit('dialog/playerHistory')
    }
  }
}
</script>

<style lang="sass">
a
  color: #8f0909
  text-decoration: none
.fmt
  background-color: #e1e2e3
.team-area
  width: 90%
.team-table
  width: 90%
.name
  font-weight: bold
.my-sticky-header-table
  thead
    background-color: #e1e2e3
</style>
