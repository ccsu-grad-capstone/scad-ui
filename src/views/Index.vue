<template lang="pug">
  q-page.flex.justify-center
    q-card.q-pa-md.q-ma-md(style="width: 100%")
      q-card-section
        .column.items-center
          img(src="../statics/scad-logo_v1_700x500.png" style="width: 40%")
      q-separator
      .row.full-width.justify-center.items-center
        .column.col.items-center Existing Users:
          q-btn(label="Login Here" dense="" no-caps="" color="primary" size="md" @click="$router.push('login')")
        .column.col.items-center New to SCAD?
          q-btn(label="Register Here" dense="" no-caps="" color="secondary" text-color="primary" size="md" @click="$router.push('register')")

</template>

<script>
export default {
  name: 'LandingPage'
}
</script>
<style lang="sass">
.LP

  &__background
    background-color: #5f6323
</style>
