<template lang="pug">
  body
    .row.full-width
      .row.full-width.justify-center
        q-circular-progress.q-mt-xl(
          indeterminate
          size="90px"
          :thickness="0.2"
          color="secondary"
          center-color="grey-3"
          track-color="primary"
          class="q-ma-md"
          )
      .row.full-width.justify-center
        .text-subtitle1.text-primary {{ message ? message : 'Fetching SCAD details...' }}

</template>

<script>

export default {
  name: 'Loading',
  props: {
    message: String
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="stylus">

.fmt
  background-color: #e1e2e3
.team-table
  width: 90%
.name
  font-weight: bold
</style>
