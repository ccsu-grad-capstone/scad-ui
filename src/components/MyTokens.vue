<template lang="pug">
    q-card.q-ma-md
      q-card-section
        .text-h6.text-weight-bolder
          | Tokens
        .text-h6
          | tokens.access_token:
        .text-caption
          | {{tokens.access_token}}
        .text-h6
          | tokens.refresh_token:
        .text-caption
          |{{tokens.refresh_token}}
        .text-h6
          | tokens.id_token:
        .text-caption
          | {{tokens.id_token}}
      .col.q-pa-md
            q-btn(label='Refresh Token' dense no-caps color='secondary' text-color='primary' size='md' @click="refreshToken")
</template>

<script>
export default {
  name: 'MyTokens',
  data () {
    return {}
  },
  mounted () {
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    tokens () {
      return this.user.tokens
    }
  },
  methods: {
    async refreshToken () {
      console.log('[DASHBOARD] - refreshToken()')
      await this.$store.dispatch('user/refreshToken')
    }
  }
}
</script>

<style lang="scss" scoped></style>
