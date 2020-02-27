<template lang="pug">
  q-card(style="width: 500px; max-width: 80vw;")
    q-card-section.row.items-center
      .col-1
        q-avatar(icon='check' color='primary' text-color='white')
      .col.text-center
        .text-h6.q-pl-md Your league is now registered with SCAD.
        .text-body1.q-pl-lg Would you like us to email everyone an invite?
    q-card-actions.row.justify-around
      q-btn(flat label='No Thanks' color='primary' @click="noThanks()")
      q-btn(flat label='Yes Please' color='primary' @click="yesPlease()")
</template>

<script>
import { createHelpers } from 'vuex-map-fields'
const { mapFields } = createHelpers({
  getterType: 'dialog/getField',
  mutationType: 'dialog/updateField'
})

export default {
  name: 'RegisterLeagueInvites',

  data () {
    return {
      emails: []
    }
  },
  computed: {
    ...mapFields([
      'registerLeagueInvites'
    ]),
    league () {
      return this.$store.state.league.league
    }
  },
  methods: {
    noThanks () {
      this.registerLeagueInvites = false
      this.$router.push({
        path: 'dashboard'
      })
    },
    yesPlease () {
      this.$store.dispatch('league/emailLeagueMembers')
      this.registerLeagueInvites = false
      this.$router.push({
        path: 'dashboard'
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
