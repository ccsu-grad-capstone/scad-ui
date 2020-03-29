<template lang="pug">
  div.q-pa-md
    .q-px-md.text-h4.text-weight-bolder My Profile
    my-profile-card
    yahoo-leagues-card
</template>

<script>
import MyProfileCard from '../components/MyProfileCard'
import YahooLeaguesCard from '../components/YahooLeaguesCard'

export default {
  name: 'MyProfile',
  components: {
    'my-profile-card': MyProfileCard,
    'yahoo-leagues-card': YahooLeaguesCard
  },

  data () {
    return {}
  },
  mounted () {
    this.$store.dispatch('league/getAllYahooLeagues')
    this.$store.dispatch('league/getAllScadLeagues')
  }
}
</script>

<style lang="scss" scoped></style>
