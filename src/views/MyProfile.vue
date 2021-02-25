<template lang="pug">
  div.q-pa-md.q-gutter-md
    .row.full-width.q-gutter-md.q-pa-md
      .text-h4.text-weight-bolder My Profile
    my-profile-card
    yahoo-leagues-card
    my-tokens(v-if='inDevelopment()')

</template>

<script>
import MyProfileCard from '../components/MyProfileCard'
import YahooLeaguesCard from '../components/YahooLeaguesCard'
import MyTokens from '../components/MyTokens'
import { inDevelopment } from '../utilities/enviornment'

export default {
  name: 'MyProfile',
  components: {
    'my-profile-card': MyProfileCard,
    'yahoo-leagues-card': YahooLeaguesCard,
    'my-tokens': MyTokens

  },

  data () {
    return {}
  },
  mounted () {
  },
  computed: {
    inDevelopment () {
      return inDevelopment
    }
  }
}
</script>

<style lang="scss" scoped></style>
