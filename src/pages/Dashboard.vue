<template>
  <q-page class="flex">
      <q-card
        class="q-pa-md q-ma-md"
        style="width: 100%"
      >
        <q-card-section>
          <div class="text-h6">
            DASHBOARD
          </div>
          <div class="text">
            Welcome, {{this.user.fName}}
          </div>
        </q-card-section>
        <q-separator />
        <div class="column items-center">
          <div class="text"></div>
        </div>

        <div class="row full-width justify-center items-center">
          <div class="column col items-center">
            Looking to join an existing league?
            <q-btn
              label="Join Here"
              dense
              no-caps
              color="primary"
              size="md"
            />
          </div>

          <div class="column col items-center">
            Looking to create a new league?
            <q-btn
              label="Create League"
              dense
              no-caps
              color="secondary"
              text-color="primary"
              size="md"
              @click="$router.push('create-league')"
            />
          </div>
        </div>
      </q-card>
  </q-page>
</template>

<script>
export default {
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
