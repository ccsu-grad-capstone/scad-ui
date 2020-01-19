<template>
  <q-page class="flex">
    <q-card class="q-pa-md q-ma-md" style="width: 100%">
      <q-card-section>
        <div class="text-h6">Create New League</div>
      </q-card-section>
      <q-separator />
      <q-form @submit="onSubmit" @reset="reset" class="q-gutter-xs col-9">
        <q-input
          filled
          v-model="$v.league.name.$model"
          label="League Name"
          lazy-rules
          :error="$v.league.name.$error"
          error-message="Required Field"
        />
        <q-select
          filled
          v-model="league.capacity"
          :options="capacity"
          label="Capacity"
        />
        <div class="row q-pa-md items-center">
          <div class="col-2">
            Team Salary Cap: ${{ league.teamCap }}
            <q-btn rounded dense color="info" size="xs" label="What's This?">
              <q-tooltip>
                To determine the salary cap limit for each team in your league.
              </q-tooltip>
            </q-btn>
          </div>
          <div class="col-10">
            <q-slider
              v-model="league.teamCap"
              :min="100"
              :max="1000"
              :step="100"
              label
              :label-value="'$' + league.teamCap"
              label-always
              color="primary"
            />
          </div>
        </div>
        <div class="row q-pa-md">
          <div class="col-2">
            League Salary Cap: ${{ league.teamCap }}
            <q-btn rounded dense color="info" size="xs" label="What's This?">
              <q-tooltip>
                Team Salary Cap x Capacity
              </q-tooltip>
            </q-btn>
          </div>
          <div class="col-10">
            <q-slider
              :value="calcLeagueCap"
              label
              :min="1600"
              :max="16000"
              readonly
              :label-value="'$' + calcLeagueCap"
              label-always
              color="primary"
            />
          </div>
        </div>

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
  </q-page>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      league: {
        name: '',
        capacity: 12,
        leagueCap: this.calcLeagueCap,
        teamCap: 250
      },
      capacity: [8, 10, 12, 14, 16]
    }
  },
  validations: {
    league: {
      name: { required }
    }
  },
  created () {
    this.data()
  },
  destroyed () {
    this.reset()
  },
  computed: {
    calcLeagueCap () {
      this.setLeagueCap()
      return this.league.leagueCap
    }
  },
  methods: {
    onSubmit () {
      console.log('[CREATELEAGUE - Methods] - onSubmit()')
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.log('CreateLeague Validation failed')
      } else {
        console.log('CreateLeague Validation Successful', this.league)
        this.$store.dispatch('league/creatLeague', this.league)
        this.$router.push({
          path: 'dashboard'
        })
      }
    },
    setLeagueCap () {
      this.league.leagueCap = this.league.teamCap * this.league.capacity
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
