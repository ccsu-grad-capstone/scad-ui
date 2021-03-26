<template lang="pug">
  q-dialog(v-model='visable' @hide="triggerDialog()")
    q-card(style="width: 800px; max-width: 80vw;")
      q-card-section.row.items-center
        .row.full-width.q-gutter-xs.items-center.justify-center.q-pb-md
          q-space
          q-avatar(size="50px")
            img(:src="player.headshot.url" style="width: 85%")
          .text-h4.q-pl-md.text-weight-bolder {{player.name.full}}
          q-space
          q-btn(icon="close" flat round dense @click="triggerDialog()")

        .row.full-width
          .col
            q-table(
              dense
              flat
              hide-bottom
              :data="scadPlayer.history"
              :columns="columns"
              row-key="_id"
            )
</template>

<script>
import moment from 'moment'

export default {
  name: 'PlayerHistoryDialog',
  props: {
    player: Object
  },
  data () {
    return {
      visable: true,
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
          field: row => row.comment
        }
      ]
    }
  },
  async mounted () {
    // console.log('playerHistoryDialog - mounted()')
    await this.getScadPlayer()
  },
  computed: {
    league () { return this.$store.state.league },
    scadPlayer () { return this.$store.state.player.scadPlayer }
  },
  methods: {
    async getScadPlayer () {
      await this.$store.dispatch('player/getScadPlayer', this.player.player_id)
    },
    triggerDialog () {
      this.$store.commit('dialog/playerHistory')
    }
  }
}
</script>

<style lang="scss" scoped></style>
