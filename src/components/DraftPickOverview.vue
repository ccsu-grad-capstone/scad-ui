<template lang="pug">
  div
    .text-weight-bold Draft Picks:
    loading(v-if="!loaded" :message="'Fetching Draft Picks...'")
    .row.justify-center.full-width.bg-white.q-py-lg(v-else-if="loaded && getDraftPicksByLeagueError")
      .row.full-width.justify-center.text-caption.text-grey-7 Issue getting draft picks try:
      .row.full-width.justify-center: q-btn.q-pa-xs(label='Refresh' color='secondary' text-color='primary' size='md' @click="getPicks()")
    q-table(
      class="my-sticky-header-table"
      v-else
      :data='draftPicksByTeam',
      :columns='columns',
      row-key= '_id',
      :pagination.sync="pagination",
      hide-bottom,
      dense,
      flat,
      square
      :hide-bottom="draftPicksByTeam.length > 0",
      no-data-label='No draft picks available'
      )
      template(v-slot:body-cell-edit='props')
        q-td.q-pr-md(:props='props' auto-width)
          q-btn(size='xs' color='accent' round dense @click='editPick(props.row)' icon="edit")
      template(v-slot:body-cell-comments='props')
        q-td.q-pr-md(:props='props')
          | {{props.row.comments}}
      template(v-slot:body-cell-condition='props')
        q-td(:props='props' auto-width)
          q-icon(v-if="props.row.hasCondition" name='fas fa-exclamation' color='negative' size='xs')
    edit-draft-pick-dialog(v-if="editDraftPick" :dp="edit.dp" @saved="getPicks")

    .col.full-width.text-center.q-pa-xs.text-grey.text-caption {{yahooTeam.name}} draft picks
</template>

<script>
import editDraftPickDialog from '../components/dialogs/editDraftPickDialog'
import Loading from '../components/Loading'
import { getTeamGuid } from '../utilities/functions'

export default {
  name: 'DraftPickOverview',
  components: {
    'edit-draft-pick-dialog': editDraftPickDialog,
    'loading': Loading

  },
  props: {
    yahooTeamId: String,
    yahooTeam: Object,
    scadTeam: Object
  },
  data () {
    return {
      teamPicks: [],
      edit: {
        visable: false,
        dp: {}
      },
      loaded: true,
      pagination: {
        page: 1,
        rowsPerPage: 36 // 0 means all rows
      },
      columns: [
        {
          name: 'edit',
          label: '',
          align: 'left',
          style: 'background-color: #f0f0f0'
        },
        {
          name: 'year',
          required: true,
          label: 'Year',
          align: 'center',
          sortable: false,
          field: row => row.year,
          format: val => `${val}`,
          style: 'background-color: #f0f0f0'
        },
        {
          name: 'rd',
          required: true,
          label: 'Round',
          align: 'center',
          sortable: false,
          field: row => row.rd,
          format: val => `${val}`
        },
        {
          name: 'pick',
          required: true,
          label: 'Pick',
          align: 'center',
          field: row => row.pick,
          format: val => {
            if (val) {
              return val
            } else {
              return '-'
            }
          },
          sortable: true
        },
        {
          name: 'condition',
          required: false,
          label: '',
          align: 'center',
          sortable: false
          // style: 'background-color: #f0f0f0'

        },
        {
          name: 'comments',
          label: 'Comments',
          align: 'left',
          field: row => row.comments,
          format: val => `${val}`,
          style: 'color: grey;'
        }
      ]
    }
  },
  async mounted () {
    // await this.draftPicksByTeam()
  },
  computed: {
    allDraftPicks () { return this.$store.state.draftPicks.draftPicks },
    draftPicksByTeam () {
      const guid = getTeamGuid(this.yahooTeam)
      let teamPicks = this.allDraftPicks.filter(dp => getTeamGuid(dp.team) === guid)
      // for (const dp of this.allDraftPicks) if (getTeamGuid(dp.team) === guid) teamPicks.push(dp)
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.loaded = true
      return teamPicks.sort(function (a, b) {
        if (a.rd === b.rd && a.year === b.year) {
          return a.pick > b.pick ? 1 : a.pick < b.pick ? -1 : 0
        } else if (a.year === b.year) {
          return a.rd > b.rd ? 1 : a.rd < b.rd ? -1 : 0
        }
      })
    },
    editDraftPick () {
      return this.$store.state.dialog.editDraftPick
    },
    scadSettings () {
      return this.$store.state.league.scadSettings
    },
    getDraftPicksByLeagueError () { return this.$store.state.draftPicks.getDraftPicksByLeagueError }

  },
  methods: {
    async getPicks () {
      console.log('getPicks')
      // return teamPicks
      await this.$store.dispatch('draftPicks/getDraftPicksByLeague')
      this.loaded = true
    },
    editPick (dp) {
      this.$store.commit('dialog/editDraftPick')
      this.edit.dp = dp
    }
  }
}
</script>

<style lang="stylus" scoped>
th
  text-align: center
  background-color: #e1e2e3
tr
  text-align: center
.pos
  font-weight: bold
  background-color: #f0f0f0
.table-width
  width: 342px
</style>
