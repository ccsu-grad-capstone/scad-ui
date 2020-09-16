<template lang="pug">
  .q-pa-sm.col-xs-4
    .text-h6.text-weight-bolder Recent Transactions #[span.text-caption.text-grey-5 (Last Run: {{ lastChecked }})]
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
      :data='filterTransactions',
      :columns='columns',
      row-key='transaction_key',
      :pagination.sync="pagination",
      hide-bottom,
      dense
      flat
      square
      )
      template(v-slot:body-cell-transaction='props')
        q-td(:props='props' v-if="props.row.type.indexOf('add') > -1 && props.row.status === 'successful'")
          .row.full-width
            .col
              .row.full-width.items-center
                .row
                  q-icon.q-pa-xs(name='fas fa-plus' color='positive' size='xs')
                .row.justify-center
                  .text-weight-bold.text-body2.text-grey-9 {{props.row.players[0].name.full}}
                  .gt-xs.text-caption.text-grey-6.text-weight-bold.q-pl-sm {{props.row.players[0].display_position}} - {{props.row.players[0].editorial_team_abbr}}
                  .text-caption.text-info.text-weight-bold.q-pl-sm (${{props.row.faab_bid ? props.row.faab_bid : '1'}} {{props.row.players[0].transaction.source_type === 'freeagents' ? 'FA' : 'Waiver'}})
              .row.full-width(v-if="props.row.players[1]")
                .row
                  q-icon.q-pa-xs(name='fas fa-minus' color='negative' size='xs')
                .row.justify-center
                  .text-weight-bold.text-body2.text-grey-9 {{props.row.players[1].name.full}}
                  .gt-xs.text-caption.text-grey-6.text-weight-bold.q-pl-sm {{props.row.players[1].display_position}} - {{props.row.players[1].editorial_team_abbr}}
                  .text-caption.text-grey-6.q-pl-sm (to {{props.row.players[1].transaction.destination_type}})
        div(v-else)
      template(v-slot:body-cell-team='props')
        q-td(:props='props' v-if="props.row.type.indexOf('add') > -1 && props.row.status === 'successful'")
          .column
            .row.items-center.q-gutter-sm
              q-avatar(size="30px")
                img( :src="getTeamPic(props.row.players[0].transaction.destination_team_key)")
              .text-weight-bold {{ props.row.players[0].transaction.destination_team_name }}
        div(v-else)

</template>

<script>
/* eslint-disable eqeqeq */

export default {
  name: 'LeagueDiagnostics',
  data () {
    return {
      loaded: false,
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
    },
    lastChecked () {
      return this.$store.state.transactions.lastChecked
    },
    filterTransactions () {
      return this.transactions.filter(t => t.type.indexOf('add') > -1 && t.status === 'successful')
    }
  },

  async mounted () {
    // await this.$store.dispatch('transactions/getTransactionTimestamp')
    // await this.$store.dispatch('transactions/getTransactions')
    this.loaded = true
  },
  methods: {
    getTeamPic (key) {
      if (key) {
        let team = this.yahooTeams.find(t => t.team_key === key)
        return team.team_logos[0].team_logo.url
      }
    },
    addDrop (row) {
      return row.type === 'add/drop'
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
