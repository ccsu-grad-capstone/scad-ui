<template lang="pug">
  q-page.flex
    q-card.q-pa-md.q-ma-md(style='width: 100%')
      q-card-section
        .text-h6
          | DASHBOARD
        .text
          | Welcome, {{this.user.email}}
      q-separator
      .column.items-center.text
        .row.full-width.justify-center.items-center
          .column.col.items-center
            | Looking to join an existing league?
            q-btn(label='Join Here' dense='' no-caps='' color='primary' size='md')
          .column.col.items-center
            | Looking to create a new league?
            q-btn(label='Create League' dense='' no-caps='' color='secondary' text-color='primary' size='md' @click="$router.push('create-league')")

</template>

<script>
export default {
  name: 'Dashboard',
  data () {
    return {}
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

<style lang="scss" scoped></style>
