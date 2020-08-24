<template lang="pug">
  .q-pa-sm.col-xs-4
    .text-h6.text-weight-bolder Recent Transactions
    q-card.full-width(v-if="!loaded")
      .row.full-width.justify-center
        q-circular-progress.q-mt-xl(
          indeterminate
          size="90px"
          :thickness="0.2"
          color="primary"
          center-color="grey-5"
          track-color="transparent"
          class="q-ma-md",
          )
      .row.full-width.justify-center.q-pb-md
        .text-grey Retrieving Transactions
    q-table(
      v-else
      :data='transactions',
      :columns='columns',
      row-key='name',
      :pagination.sync="pagination",
      hide-bottom,
      dense
      flat
      square
      )
      template(v-slot:body-cell-transaction='props')
        q-td(:props='props')
          .row.full-width
            .col
              .row.full-width
                .column
                  q-icon.q-pa-xs(name='fas fa-plus' color='positive' size='xs')
                .column.justify-center
                  .text-caption.text-grey-6 #[span.text-weight-bold.text-body2.text-grey-9 Dereck Carr] #[span.text-weight-bold QB - LV] #[span ($1 Free Agent)]
              .row.full-width
                .column
                  q-icon.q-pa-xs(name='fas fa-minus' color='negative' size='xs')
                .column.justify-center
                  .text-caption.text-grey-6 #[span.text-weight-bold.text-body2.text-grey-9 Dereck Carr] #[span.text-weight-bold QB - LV] #[span (To Waivers)]
      template(v-slot:body-cell-team='props')
        q-td(:props='props')
          .column
            .row.justify-center.items-center.q-gutter-sm
              q-avatar(size="35px")
                img( :src="getTeamPic(props.row.transaction_data.destination_team_key)")
              .text-weight-bold {{ props.row.transaction_data.destination_team_name}}

</template>

<script>
/* eslint-disable eqeqeq */

export default {
  name: 'LeagueDiagnostics',
  data () {
    return {
      loaded: true,
      pagination: {
        page: 1,
        rowsPerPage: 10 // 0 means all rows
      },
      columns: [
        {
          name: 'transaction',
          required: true,
          align: 'left',
          label: 'Transaction',
          headerClasses: 'bg-grey-3'
        },
        {
          name: 'team',
          required: true,
          label: 'Team:',
          align: 'center',
          sortable: false,
          headerClasses: 'bg-grey-3'
        }
      ]
    }
  },
  computed: {
    league () {
      return this.$store.state.league
    },
    yahooTeams () {
      return this.league.yahooTeams
    },
    scadTeams () {
      return this.league.scadTeams
    },
    scadSettings () {
      return this.league.scadSettings
    },
    transactions () {
      return this.$store.state.transactions.transactions
    }
  },

  async created () {

  },
  methods: {
    getTeamPic (key) {
      let team = this.yahooTeams.find(t => t.team_key === key)
      return team.team_logos[0].team_logo.url
    }
  }

}
</script>

<style lang="stylus" scoped>
  a
    color: #000000
    text-decoration: none
  .table-width
    width: 100px
  .qty
    font-weight: bold
    color: #000000
  .status
    font-weight: bold
</style>
