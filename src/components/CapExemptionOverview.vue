<template lang="pug">
  .q-px-md
    .text-weight-bold Cap Exemptions:
    q-table(
      class="my-sticky-header-table"
      dense
      v-if="loaded"
      :data='capExemptionsByTeam',
      :columns='columns',
      row-key= '_id',
      :pagination.sync="pagination",
      :hide-bottom="capExemptionsByTeam.length > 0",
      no-data-label='No cap exemptions available'

      )
      template(v-slot:body-cell-year='props')
        q-td(:props='props' auto-width)
          div.q-pr.text-weight-bold {{ props.row.year }}
      template(v-slot:body-cell-type='props')
        q-td(:props='props' auto-width)
          div.q-pr {{ getType(props.row) }}
      template(v-slot:body-cell-amount='props')
        q-td(:props='props' auto-width)
          div.q-pr(:class="{'text-negative text-weight-bold': getType(props.row) === 'Give', 'text-positive text-weight-bold': getType(props.row) === 'Recieve'}") ${{ props.row.amount }}
      template(v-slot:body-cell-otherTeam='props')
        q-td(:props='props' auto-width)
          div.q-pr {{ getOtherTeam(props.row) }}
      template(v-slot:body-cell-edit='props')
        q-td.q-pr-md(:props='props' auto-width)
          q-btn(size='xs' color='accent' round dense @click='editCE(props.row)' icon="edit")
    edit-cap-exemption-dialog(v-if="editCapExemption" :capExemption="edit.ce" @saved="getExemptions")

    .col.full-width.text-center.q-pa-xs.text-grey.text-caption {{yahooTeam.name}} cap exemptions
</template>

<script>
import editCapExemptionDialog from '../components/dialogs/editCapExemptionDialog'

export default {
  name: 'CapExemptionOverview',
  components: {
    'edit-cap-exemption-dialog': editCapExemptionDialog
  },
  props: {
    yahooTeamId: String,
    yahooTeam: Object,
    scadTeam: Object
  },
  data () {
    return {
      capExemptions: [],
      edit: {
        visable: false,
        ce: {}
      },
      loaded: false,
      pagination: {
        page: 1,
        rowsPerPage: 36 // 0 means all rows
      },
      columns: [
        {
          name: 'year',
          required: true,
          label: 'Year:',
          align: 'left',
          style: 'background-color: #f0f0f0'
        },
        {
          name: 'type',
          required: true,
          label: 'Type:',
          align: 'left'
        },
        {
          name: 'amount',
          required: true,
          label: 'Amt:',
          align: 'left'
        },
        {
          name: 'otherTeam',
          label: 'Other Team:',
          align: 'left'
        },
        {
          name: 'edit',
          label: '',
          align: 'left'
        }
      ]
    }
  },
  async mounted () {
    this.loaded = true
  },
  computed: {
    capExemptionsByTeam () {
      return this.$store.state.capExemptions.capExemptionsByTeam
    },
    editCapExemption () {
      return this.$store.state.dialog.editCapExemption
    },
    scadSettings () {
      return this.$store.state.league.scadSettings
    }
  },
  methods: {
    editCE (ce) {
      this.$store.commit('dialog/editCapExemption')
      this.edit.ce = ce
    },
    getType (ce) {
      if (ce.yahooTeamGive.team_id === this.yahooTeam.team_id) {
        return 'Give'
      } else {
        return 'Recieve'
      }
    },
    getOtherTeam (ce) {
      if (ce.yahooTeamGive.team_id === this.yahooTeam.team_id) {
        return ce.yahooTeamRecieve.name
      } else {
        return ce.yahooTeamGive.name
      }
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

</style>
