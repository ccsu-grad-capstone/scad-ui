<template lang="pug">
  body
    div
      h3 My Profile
      my-profile-card
</template>

<script>
import MyProfileCard from '../components/MyProfileCard'

export default {
  name: 'MyProfile',
  components: {
    'my-profile-card': MyProfileCard
  },

  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped></style>
