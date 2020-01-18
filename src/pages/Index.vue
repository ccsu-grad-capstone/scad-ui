<template>
  <q-page class="flex flex-center">
    <div class="column items-center">
      <h3>Welcome to SCAD</h3>
      <h4>Salary Cap Dynasty Fantasy Football</h4>
      <div class="row full-width justify-center items-center">
        <div class="column col items-center">
          Existing Users:
          <q-btn
            label="Login Here"
            dense
            no-caps
            color="grey-4"
            text-color="grey-8"
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
            color="grey-4"
            text-color="grey-8"
            f
            size="md"
            @click="$router.push('register')"
          />
        </div>
      </div>
    </div>
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
