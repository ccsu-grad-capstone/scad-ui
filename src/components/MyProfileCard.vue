<template lang="pug">
    div.q-pa-md.row.items-start.q-gutter-md
      .col-8
        q-card.my-card(flat bordered)
          q-item-section.q-pa-md
            img(src="../statics/logo-set/scad-4.png" style="width: 50%")
          q-separator
          q-item-section
            div.text-h5 {{ name }}
            div.text-body1 {{user.email}}
            q-separator
            q-card-section(horizontal)
              q-card-section
                |  User Since:
              q-separator(vertical)
              q-card-section.col-4
                | Lorem ipsum dolor sit amet, consectetur adipiscing elit.

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
    name () {
      return this.$store.getters['user/name']
    }
  }
}
</script>

<style lang="scss" scoped></style>
