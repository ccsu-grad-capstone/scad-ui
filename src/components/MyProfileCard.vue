<template lang="pug">
  div.q-pa-md.row.items-start.q-gutter-md
    q-card.q-pa-md.row(style='width: 100%')
      .col-3.q-pa-md
        .row.justify-center
          img(:src="getProfilePic()" style="width: 60%")
      .col-7.q-px-md(horizontal)
        div.text-body1
        q-card-section
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
      return this.user.user.profileImages.image128
    }
  }
}
</script>

<style lang="scss" scoped></style>
