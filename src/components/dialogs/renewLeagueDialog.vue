<template lang="pug">
  q-dialog(v-model='visable' persistent)
    q-card(style="width: 600px; max-width: 80vw;")
      q-card-section.row.items-center
        .col.text-center.q-gutter-sm
          .text-h4.q-pl-md.text-weight-bolder {{league.yahooLeagueDetails.name}}
          .text-body1.q-pl-md.text-weight-bold Looks like you've renewed your league via Yahoo!
          .text-body2.q-pl-lg Would you like to renew your Scad League now?
      q-card-actions.row.justify-around
        q-btn(flat label='No, Not Yet' color='primary' @click="triggerDialog()")
        q-btn(flat label='Yes Please!' color='primary' @click="renewLeague()")
</template>

<script>
import { api } from '../../utilities/axios-node'
import { catchAxiosError } from '../../utilities/catchAxiosErrors'
import notify from '../../utilities/nofity'

export default {
  name: 'RenewLeagueDialog',
  props: {
    emailLeagueId: Number
  },
  data () {
    return {
      visable: true
    }
  },
  mounted () {
    // console.log('renewLeagueDialog - mounted()')
  },
  computed: {
    tokens () { return this.$store.state.user.tokens },
    league () { return this.$store.state.league }
  },
  methods: {
    async renewLeague () {
      console.log('renewLeague')
      this.$q.loading.show({
        message: 'Sit tight while we renew your SCAD league'
      })
      try {
        const response = await api(
          this.tokens.access_token,
          this.tokens.id_token)
          .post(`/scad/league/${this.league.scadLeagueId}/renew/${this.league.renewedAvailable}`)
        console.log(response.data)
        notify.success(response.data)
        await this.$store.dispatch('league/dashboard')
        this.$router.push('/dashboard')
      } catch (err) {
        catchAxiosError(err)
      }
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = void 0
      }, 5000)
      this.triggerDialog()
    },
    triggerDialog () {
      this.$store.commit('dialog/renewLeague')
    }
  }
}
</script>

<style lang="scss" scoped></style>
