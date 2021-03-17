<template lang="pug">
  q-card.q-pa-md.row
    .col-xl-3.col-lg-3.col-md-3.col-sm-5.col-xs-5
      .row.justify-center.align-center
        img(:src="getProfilePic()")
    .column.q-px-md.justify-center
      .row.text-body1
        q-card-section
          .text-h4.text-weight-bolder {{ user.user.name }}
          | {{user.user.email}}
</template>

<script>
export default {
  name: 'MyProfileCard',

  data () {
    return {}
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    scadLeagues () {
      return this.$store.state.league.scadLeagues
    }
  },
  methods: {
    getProfilePic () {
      return this.user.user.profile_images.image128
    }
  }
}
</script>

<style lang="scss" scoped></style>
