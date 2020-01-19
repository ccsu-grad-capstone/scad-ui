<template>
  <q-page class="flex justify-center">
    <q-card class="q-pa-md q-ma-md" style="width: 100%">
      <q-card-section>
        <div class="column items-center">
          <q-img src="../statics/scad-logo_v1_700x500.png" style="width: 40%" />
        </div>
      </q-card-section>
      <q-separator />
      <div class="column items-center">
        <div class="text"></div>
      </div>

      <div class="row full-width justify-center items-center">
        <div class="column col items-center">
          Existing Users:
          <q-btn
            label="Login Here"
            dense
            no-caps
            color="primary"
            size="md"
            @click="$router.push('login')"
          />
        </div>

        <div class="column col items-center">
          New to SCAD?
          <q-btn
            label="Register Here"
            dense
            no-caps
            color="secondary"
            text-color="primary"
            size="md"
            @click="$router.push('register')"
          />
        </div>
      </div>
    </q-card>
  </q-page>
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
