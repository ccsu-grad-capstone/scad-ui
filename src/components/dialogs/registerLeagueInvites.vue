<template lang="pug">
  q-card(style="width: 600px; max-width: 80vw;")
    q-card-section.row.items-center
      .col-1
        q-avatar(icon='email' color='primary' text-color='white')
      .col.text-center
        .text-h6.q-pl-md Thanks for registering your league with SCAD!
        .text-body1.q-pl-lg Would you like us to email everyone an invite?
    q-card-actions.row.justify-around
      q-btn(flat label='No Thanks' color='primary' @click="triggerDialog()")
      q-btn(flat label='Yes Please' color='primary' @click="sendEmail()")
</template>

<script>
import { nodeHeader } from '../../utilities/axios-node'
import { catchAxiosScadError } from '../../utilities/catchAxiosErrors'
import notify from '../../utilities/nofity'

export default {
  name: 'RegisterLeagueInvites',
  props: {
    emailLeagueId: Number
  },
  data () {
    return {
      emails: []
    }
  },
  computed: {
    tokens () {
      return this.$store.state.user.tokens
    },
    league () {
      return this.$store.state.league.yahooLeague
    },
    registerLeagueInvites () {
      return this.$store.state.dialog.registerLeagueInvites
    }
  },
  methods: {

    async sendEmail () {
      console.log('[REGISTERLEAGUE - Methods] - sendInviteEmail()')
      try {
        const response = await nodeHeader(
          this.tokens.access_token,
          this.tokens.id_token)
          .post(`/scad/email/registered/${this.emailLeagueId}`)
        this.$store.commit('dialog/registerLeagueInvites')
        notify.emailCommissioner(response.data.msg)
      } catch (err) {
        catchAxiosScadError(err)
      }
    },
    triggerDialog () {
      this.$store.commit('dialog/registerLeagueInvites')
    }
  }
}
</script>

<style lang="scss" scoped></style>
