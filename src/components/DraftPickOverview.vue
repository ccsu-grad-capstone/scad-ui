<template lang="pug">
  .q-px-md
    .text-weight-bold Draft Picks:
    q-table.table-width(
      class="my-sticky-header-table"
      v-if="loaded"
      :data='draftPicksByTeam',
      :columns='columns',
      row-key= '_id',
      :pagination.sync="pagination",
      hide-bottom,
      dense
      :hide-bottom="draftPicksByTeam.length > 0",
      no-data-label='No draft picks available'
      )
      template(v-slot:body-cell-edit='props')
        q-td.q-pr-md(:props='props' auto-width)
          q-btn(size='xs' color='accent' round dense @click='editPick(props.row)' icon="edit")
      template(v-slot:body-cell-comments='props')
        q-td.q-pr-md(:props='props')
          | {{props.row.comments}}
    edit-draft-pick-dialog(v-if="editDraftPick" :dp="edit.dp" @saved="getPicks")

    .col.full-width.text-center.q-pa-xs.text-grey.text-caption {{yahooTeam.name}} draft picks
</template>

<script>
import editDraftPickDialog from '../components/dialogs/editDraftPickDialog'

export default {
  name: 'DraftPickOverview',
  components: {
    'edit-draft-pick-dialog': editDraftPickDialog
  },
  props: {
    yahooTeamId: String,
    yahooTeam: Object,
    scadTeam: Object
  },
  data () {
    return {
      draftPicks: [],
      edit: {
        visable: false,
        dp: {}
      },
      loaded: false,
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
          label: 'Year:',
          align: 'left',
          sortable: false,
          field: row => row.year,
          format: val => `${val}`,
          style: 'background-color: #f0f0f0'
        },
        {
          name: 'rd',
          required: true,
          label: 'Round:',
          align: 'center',
          sortable: false,
          field: row => row.rd,
          format: val => `${val}`
        },
        {
          name: 'pick',
          required: true,
          label: 'Pick:',
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
    await this.getPicks()
    this.loaded = true
  },
  computed: {
    draftPicksByTeam () {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.$store.state.draftPicks.draftPicksByTeam.sort(function (a, b) {
        if (a.rd === b.rd) { return a.pick > b.pick ? 1 : a.pick < b.pick ? -1 : 0 }
      })
    },
    editDraftPick () {
      return this.$store.state.dialog.editDraftPick
    },
    scadSettings () {
      return this.$store.state.league.scadSettings
    }
  },
  methods: {
    getPicks () {
      this.$store.dispatch('draftPicks/getDraftPicksByTeam', { teamId: this.yahooTeamId, year: this.scadSettings.seasonYear })
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
