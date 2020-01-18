<template>
  <q-page class="flex flex-center column">
    <div class="q-pa-md full-width justify-center " style="max-width: 600px">
      <q-card class="q-pa-md">
        <q-card-section>
          <div class="text-h6">SCAD: Salary Cap Dynasty Fantasy Football</div>
          <div class="text-subtitle2">Register Now</div>
        </q-card-section>
        <q-separator />
        <q-form @submit="onSubmit" @reset="reset" class="q-gutter-xs col-9">
          <q-input
            filled
            v-model="$v.user.fName.$model"
            label="First Name"
            lazy-rules
            :error="$v.user.fName.$error"
            error-message="Required Field"
          />
          <q-input
            filled
            v-model="$v.user.lName.$model"
            label="Last Name"
            lazy-rules
            :error="$v.user.lName.$error"
            error-message="Required Field"
          />
          <q-input
            filled
            type="email"
            v-model="user.email"
            label="Email"
            lazy-rules
            :error="$v.user.email.$error"
            error-message="Please enter a valid email address"
          />
          <q-input
            filled
            type="password"
            v-model="$v.user.password.$model"
            label="Password"
            lazy-rules
            :error="$v.user.password.$error"
            error-message="Required Field"
          />
          <q-input
            filled
            type="password"
            v-model="user.confirmPassword"
            label="Confirm Password"
            lazy-rules
            :error="$v.user.confirmPassword.$error"
            error-message="Passwords do not match"
          />
          <q-btn-group spread>
            <q-btn
              label="Submit"
              type="submit"
              dense
              no-caps
              color="grey-4"
              text-color="grey-8"
              size="md"
            />
            <q-btn
              label="Reset"
              type="reset"
              dense
              no-caps
              color="grey-4"
              text-color="grey-8"
              size="md"
            />
          </q-btn-group>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { required, email, sameAs } from 'vuelidate/lib/validators'
export default {
  data () {
    return this.initializeState()
  },
  validations: {
    user: {
      fName: { required },
      lName: { required },
      // Accepts valid email addresses. Keep in mind you still have to carefully
      // verify it on your server, as it is impossible to tell if the address is
      // real without sending verification email.
      email: { required, email },
      password: { required },
      confirmPassword: {
        sameAsPassword: sameAs('password')
      }
    }
  },
  destroyed () {
    this.reset()
  },
  methods: {
    onSubmit () {
      console.log('[REGISTERUSER - Methods] - onSubmit()')
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.log('Register Validation failed')
      } else {
        console.log('Register Validation Successful', this.user)
        this.$store.dispatch('user/registerUser', this.user)
        this.$router.push({
          path: 'dashboard'
        })
      }
    },
    initializeState () {
      return {
        user: {
          fName: '',
          lName: '',
          email: '',
          password: '',
          confirmPassword: ''
        }
      }
    },
    reset: function () {
      Object.assign(this.$data, this.initializeState())
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
