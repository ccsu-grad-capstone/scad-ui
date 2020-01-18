<template>
  <div>
    <h3>Dashboard</h3>
    <h6 v-if="loggedIn">Welcome, {{ user.fName }}</h6>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    loggedIn () {
      return this.user.active
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
