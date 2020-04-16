<template lang="pug">
  .q-pa-md
    q-table(
      class="my-sticky-header-table"
      v-if="loaded"
      :data='draftPicksByTeam',
      :columns='columns',
      row-key= '_id',
      :pagination.sync="pagination",
      hide-bottom,
      dense
      )
      template(v-slot:body-cell-edit='props')
        q-td.q-pr-md(:props='props' auto-width)
          q-btn(size='xs' color='accent' round dense @click='editPick(props.row)' icon="edit")

    .col.full-width.text-center.q-pa-xs.text-grey.text-caption {{yahooTeam.name}} draft picks
</template>

<script>
export default {
  name: 'DraftPickOverview',
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
          name: 'year',
          required: true,
          label: 'Year:',
          align: 'left',
          sortable: false,
          field: row => row.year,
          format: val => `${val}`,
          style: 'background-color: #f0f0f0'
          // headerClasses: 'bg-grey-3'
        },
        {
          name: 'rd',
          required: true,
          label: 'Round:',
          align: 'center',
          sortable: false,
          field: row => row.rd,
          format: val => `${val}`
          // headerClasses: 'bg-grey-3'
        },
        {
          name: 'pick',
          required: true,
          label: 'Pick:',
          align: 'center',
          field: row => row.pick,
          format: val => {
            if (val !== undefined) {
              return `${val}`
            } else {
              return '-'
            }
          },
          sortable: true
          // headerClasses: 'bg-grey-3',
          // // style: 'max-width: 100px'
        },
        // {
        //   name: 'owner',
        //   required: true,
        //   label: 'Owner:',
        //   align: 'left',
        //   style: 'width: 200px',
        //   field: row => row.team.name,
        //   format: val => `${val}`
        // },
        {
          name: 'comments',
          label: 'Comments',
          align: 'left',
          field: row => row.comments,
          format: val => `${val}`,
          style: 'color: grey'
        },
        {
          name: 'edit',
          label: '',
          align: 'left'
        }
      ]
    }
  },
  mounted () {
    this.$store.dispatch('draftPicks/getDraftPicksByTeam', this.yahooTeamId)
    this.loaded = true
  },
  computed: {
    draftPicksByTeam () {
      return this.$store.state.draftPicks.draftPicksByTeam
    }
  },
  methods: {
    editPick (dp) {
      this.edit.visable = true
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

</style>
