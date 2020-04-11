<template lang="pug">
    .fixed-center.text-center
      p
      p.text-faded
        | Sorry, nothing here...
        strong (404)
      q-btn(color="secondary" style="width:200px;" to="/" label="Go back")

</template>

<script>
export default {
  name: 'Error404'
}
</script>
