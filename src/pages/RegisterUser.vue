<template>
  <div class="flex flex-center column">
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
            v-model="user.fName"
            label="First Name"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please type something']"
          />
          <q-input
            filled
            v-model="user.lName"
            label="Last Name"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please type something']"
          />
          <q-input
            filled
            type="email"
            v-model="user.email"
            label="Email"
            lazy-rules
            :rules="[
              val =>
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val) ||
                'Invalid Email'
            ]"
          />

          <q-input
            filled
            type="password"
            v-model="user.password"
            label="Password"
            lazy-rules
            :rules="[
              val =>
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(
                  val
                ) ||
                'Password must have 1 uppercase, 1 lowercase, 1 number and one special character'
            ]"
          />
          <q-input
            filled
            type="password"
            v-model="user.confirmPassword"
            label="Confirm Password"
            lazy-rules
            :rules="[val => val === user.password || 'Your passwords do not match']"
          />
          <div>
            <q-btn label="Submit" type="submit" color="primary" />
            <q-btn
              label="Reset"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
            />
          </div>
        </q-form>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return this.initializeState()
  },
  methods: {
    onSubmit () {
      console.log(this.user)
      this.reset()
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
    register () {
    },
    reset: function () {
      Object.assign(this.$data, this.initializeState())
      this.resetValidation()
    }
    // resetValidation () {
    //   this.$refs.fName.resetValidation()
    //   this.$refs.lName.resetValidation()
    //   this.$refs.email.resetValidation()
    //   this.$refs.password.resetValidation()
    //   this.$refs.confirmpassword.resetValidation()
    // }
  }
}
</script>

<style lang="stylus" scoped></style>
