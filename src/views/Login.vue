<template lang="pug">
  q-page.flex.flex-center.column
    .q-pa-md.full-width.justify-center(style="max-width: 500px")
      q-card.q-pa-md
        q-card-section
          .text-h6 Login
        q-separator
        q-form.q-gutter-xs.col-9(@submit="onSubmit" @reset="reset")
          q-input(filled="" type="email" v-model="email" label="Email" lazy-rules="" :error="$v.email.$error" error-message="Please enter a valid email address")
          q-input(filled="" type="password" v-model="password" label="Password" lazy-rules="" :error="$v.password.$error" error-message="Required Field")
          q-btn-group(spread="")
            q-btn(label="Login" type="submit" dense="" no-caps="" color="grey-1" text-color="grey-8" size="md")
            q-btn(label="Reset" type="submit" dense="" no-caps="" color="grey-1" text-color="grey-8" size="md" @click.prevent="reset")
            q-btn(label="Register Here" type="submit" dense="" no-caps="" color="grey-1" text-color="grey-8" size="md" @click.prevent="register")

</template>

<script>
import { required, email } from 'vuelidate/lib/validators'

export default {
  name: 'Login',

  data () {
    return {
      email: '',
      password: ''
    }
  },
  validations: {
    email: { required, email },
    password: { required }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    onSubmit () {
      console.log('[LOGIN - Methods] - onSubmit()')
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.log('Login Validation failed')
      } else {
        let user = {
          email: this.email,
          password: this.password
        }
        this.$store.dispatch('user/loginUser', user).then(() => {
          if (this.user.isActive) {
            this.$router.push({
              path: '/dashboard'
            })
          } else {
            this.$router.push({
              path: '/'
            })
          }
        })
      }
    },
    register () {
      // Do what you want here.
      this.$router.push({
        path: 'register'
      })
    },
    reset: function () {
      this.resetValidation()
    },
    resetValidation () {
      this.$nextTick(() => {
        this.$v.$reset()
      })
    }
  }
}
</script>

<style lang="stylus" scoped></style>
