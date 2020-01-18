<template>
  <q-page class="flex flex-center">
    <div class="column items-center">
      <h3>Welcome to SCAD</h3>
      <h4>Salary Cap Dynasty Fantasy Football</h4>
      <h6>
        New to SCAD?
        <q-btn rounded size="xs" @click="$router.push('register'), clickable"
          >Register Here</q-btn
        >
      </h6>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'LandingPage'
}
</script>
