<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-header elevated class="bg-white text-grey-8" height-hint="64">
      <q-toolbar class="GNL__toolbar">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
          class="q-mr-sm"
        />

        <q-toolbar-title
          v-if="$q.screen.gt.xs"
          shrink
          class="row items-center no-wrap"
        >
          <img src="../statics/scad-logo_v1_100x30.png" clickable @click="iconNavigate"/>
        </q-toolbar-title>

        <q-space />

        <q-input
          class="GNL__toolbar-input"
          outlined
          dense
          v-model="search"
          color="bg-grey-7 shadow-1"
          placeholder="Search for topics, locations & sources"
        >
          <template v-slot:prepend>
            <q-icon v-if="search === ''" name="search" />
            <q-icon
              v-else
              name="clear"
              class="cursor-pointer"
              @click="search = ''"
            />
          </template>
          <template v-slot:append>
            <q-btn flat dense round aria-label="Menu" icon="arrow_drop_down">
              <q-menu anchor="bottom right" self="top right">
                <div class="q-pa-md" style="width: 400px">
                  <div class="text-body2 text-grey q-mb-md">
                    Narrow your search results
                  </div>

                  <div class="row items-center">
                    <div class="col-3 text-subtitle2 text-grey">
                      Exact phrase
                    </div>
                    <div class="col-9 q-pl-md">
                      <q-input dense v-model="exactPhrase" />
                    </div>

                    <div class="col-3 text-subtitle2 text-grey">
                      Has words
                    </div>
                    <div class="col-9 q-pl-md">
                      <q-input dense v-model="hasWords" />
                    </div>

                    <div class="col-3 text-subtitle2 text-grey">
                      Exclude words
                    </div>
                    <div class="col-9 q-pl-md">
                      <q-input dense v-model="excludeWords" />
                    </div>

                    <div class="col-3 text-subtitle2 text-grey">
                      Website
                    </div>
                    <div class="col-9 q-pl-md">
                      <q-input dense v-model="byWebsite" />
                    </div>

                    <div class="col-12 q-pt-lg row justify-end">
                      <q-btn
                        flat
                        dense
                        no-caps
                        color="grey-7"
                        size="md"
                        style="min-width: 68px;"
                        label="Search"
                        v-close-popup
                      />
                      <q-btn
                        flat
                        dense
                        no-caps
                        color="grey-7"
                        size="md"
                        style="min-width: 68px;"
                        @click="onClear"
                        label="Clear"
                        v-close-popup
                      />
                    </div>
                  </div>
                </div>
              </q-menu>
            </q-btn>
          </template>
        </q-input>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap" v-if="active">
          <q-btn
            v-if="$q.screen.gt.sm"
            round
            dense
            flat
            color="text-grey-7"
            icon="apps"
          >
            <q-tooltip>Google Apps</q-tooltip>
          </q-btn>
          <q-btn round dense flat color="grey-8" icon="notifications">
            <q-badge color="red" text-color="white" floating>
              2
            </q-badge>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn>
          <q-btn round flat>
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
            <q-tooltip>Account</q-tooltip>
          </q-btn>
        </div>
        <q-btn v-else round color="accent" dense icon="supervised_user_circle">
          <q-menu anchor="bottom right" self="top right">
            <div class="q-pa-md" style="width: 400px">
              <div class="text-body1 text-grey-8 q-mb-md">
                Login
              </div>

              <div class="row items-center">
                <div class="col-3 text-subtitle2 text-grey">
                  Email:
                </div>
                <div class="col-9 q-pl-md">
                  <q-input dense v-model="email " :error="$v.email.$error" error-message="Please enter a valid email address" />
                </div>

                <div class="col-3 text-subtitle2 text-grey">
                  Password:
                </div>
                <div class="col-9 q-pl-md">
                  <q-input dense v-model="password" :error="$v.password.$error" error-message="Required Field" />
                </div>
                <div class="col-12 q-pt-lg row justify-end">
                  <q-btn
                    flat
                    dense
                    no-caps
                    color="grey-7"
                    size="md"
                    style="min-width: 68px;"
                    label="Login"
                    @click="login"
                  />
                  <q-btn
                    flat
                    dense
                    no-caps
                    color="red-7"
                    size="md"
                    style="min-width: 68px;"
                    label="Cancel"
                    v-close-popup
                  />
                </div>
              </div>
            </div>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="this.loggedIn"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-white"
      :width="230"
    >
      <q-scroll-area class="fit">
        <q-list padding class="text-grey-8">
          <q-item
            class="GNL__drawer-item"
            @click="navigate(link.route)"
            v-ripple
            v-for="link in links1"
            :key="link.text"
            clickable
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator inset class="q-my-sm" />

          <q-item
            class="GNL__drawer-item"
            @click="link.click"
            v-ripple
            v-for="link in links3"
            :key="link.text"
            clickable
          >
            <q-item-section>
              <q-item-label
                >{{ link.text }} <q-icon v-if="link.icon" :name="link.icon"
              /></q-item-label>
            </q-item-section>
          </q-item>

          <div class="q-mt-md">
            <div class="flex flex-center q-gutter-xs">
              <a
                class="GNL__drawer-footer-link"
                @click="logout"
                aria-label="Privacy"
                >Logout</a
              >
              <span> · </span>
              <a
                class="GNL__drawer-footer-link"
                href="javascript:void(0)"
                aria-label="Terms"
                >Terms</a
              >
              <span> · </span>
              <a
                class="GNL__drawer-footer-link"
                @click="navigate('register')"
                aria-label="Register"
                >Register</a
              >
            </div>
          </div>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'

export default {
  name: 'DefaultLayout',

  data () {
    return {
      email: '',
      password: '',
      leftDrawerOpen: false,
      search: '',
      showAdvanced: false,
      showDateOptions: false,
      exactPhrase: '',
      hasWords: '',
      excludeWords: '',
      byWebsite: '',
      byDate: 'Any time',
      links1: [
        { icon: 'dashboard', text: 'Dashboard', route: 'dashboard' },
        { icon: 'home', text: 'League Home', route: 'league-home' },
        { icon: 'list', text: 'My Team', route: 'my-team' },
        { icon: 'event', text: 'Matchups', route: 'matchup' },
        { icon: 'people', text: 'Free Agents', route: 'free-agents' },
        {
          icon: 'settings_applications',
          text: 'League Settings',
          route: 'league-settings'
        }
      ],
      links3: [
        { icon: '', text: 'My Profile', click: 'myProfile' },
        { icon: '', text: 'About', click: 'about' },
        { icon: 'logout', text: 'Logout', click: 'logout' }
      ]
    }
  },
  validations: {
    email: { required, email },
    password: { required }
  },

  computed: {
    appName () {
      return this.$store.state.app.appName
    },
    user () {
      return this.$store.state.user
    },
    active () {
      return this.user.active
    },
    loggedIn () {
      return this.user.active
    }
  },
  methods: {
    navigate: function (nav) {
      // Do what you want here.
      console.log('in MyLayout navigate')
      this.$router.push({
        path: nav
      }).catch(error => {
        if (error.name !== 'NavigationDuplicated') {
          throw error
        }
      })
    },
    onClear () {
      this.exactPhrase = ''
      this.hasWords = ''
      this.excludeWords = ''
      this.byWebsite = ''
      this.byDate = 'Any time'
    },
    changeDate (option) {
      this.byDate = option
      this.showDateOptions = false
    },
    login () {
      console.log('[LOGIN - Methods] - login()')
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
    logout () {
      console.log('logout()')
      this.$store.commit('user/logoutUser')
      // eslint-disable-next-line handle-callback-err
      this.$router.push('/').catch(error => {
        if (error.name !== 'NavigationDuplicated') {
          throw error
        }
      })
    },
    iconNavigate () {
      if (this.loggedIn) {
        this.navigate('dashboard')
      } else {
        this.navigate('/')
      }
    }
  }
}
</script>

<style lang="sass">
.GNL

  &__toolbar
    height: 64px

  &__toolbar-input
    width: 40%

  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px

    .q-item__section--avatar
      .q-icon
        color: #5f6368

    .q-item__label
      color: #3c4043
      letter-spacing: .01785714em
      font-size: .875rem
      font-weight: 500
      line-height: 1.25rem

  &__drawer-footer-link
    color: inherit
    text-decoration: none
    font-weight: 500
    font-size: .75rem

    &:hover
      color: #000
</style>
