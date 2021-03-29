<template lang="pug">
  q-dialog(v-model='visable' @hide="triggerDialog()")
    q-card(style="width: 800px; max-width: 80vw;")
      loading(v-if="!loaded" :message="'Fetching Player History...'")
      .div(v-else)
        .row.items-center.q-pa-sm.bg-grey-4
          .row.full-width.q-gutter-xs.items-center.justify-center
            q-space
            q-avatar(size="70px" color='white')
              img.q-pa-xs(:src="yahooPlayer.headshot.url" style="width: 85%")
            .text-h4.q-pl-md.text-weight-bolder {{yahooPlayer.name.full}}
            q-space
            q-btn(icon="close" flat round dense @click="triggerDialog()")

        q-card-section.row.items-center
          .row.full-width
            .col
              q-table(
                dense
                flat
                hide-bottom
                :data="history"
                :columns="columns"
                row-key="_id"
                :pagination.sync="pagination"
              )
                template(v-slot:body-cell-comment='props')
                  q-td(auto-width)
                    | {{ props.row.comment }} #[span.text-grey-6 ({{ props.row.team.name }})]

</template>

<script>
import moment from 'moment'
import Loading from '../../components/Loading'

export default {
  name: 'PlayerHistoryDialog',
  components: {
    'loading': Loading
  },
  props: {
    yahooPlayer: Object,
    scadPlayer: Object
  },
  data () {
    return {
      loaded: false,
      visable: true,
      pagination: {
        page: 1,
        // sortBy: 'date',
        // descending: true,
        rowsPerPage: 0 // 0 means all rows
      },
      columns: [
        {
          name: 'date',
          label: 'Date',
          field: row => moment(row.date).format('lll'),
          align: 'left'
        },
        {
          name: 'team',
          label: 'Team',
          field: row => row.team.name,
          align: 'left'

        },
        {
          name: 'originalSalary',
          label: 'Prev Salary',
          field: row => `$${row.originalSalary}`,
          align: 'left'
        },
        {
          name: 'salary',
          label: 'Salary',
          field: row => `$${row.newSalary}`,
          align: 'left'

        },
        {
          name: 'comment',
          label: 'Comments',
          align: 'left'
        }
      ]
    }
  },
  mounted () {
    // console.log('playerHistoryDialog - mounted()')
    this.getScadPlayer()
  },
  computed: {
    league () { return this.$store.state.league },
    storeScadPlayer () { return this.$store.state.player.scadPlayer },
    history () {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      let history = this.scadPlayer ? this.scadPlayer.history : this.storeScadPlayer.history
      return history.sort(function (a, b) {
        if (moment(a.date).isBefore(b.date)) return 1
        else return -1
      })
    }
  },
  methods: {
    async getScadPlayer () {
      this.loaded = false
      if (!this.scadPlayer) {
        await this.$store.dispatch('player/getScadPlayer', this.yahooPlayer.player_id)
      }
      this.loaded = true
    },
    triggerDialog () {
      this.$store.commit('dialog/playerHistory')
    }
  }
}
</script>

<style lang="scss" scoped></style>
