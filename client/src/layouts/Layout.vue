<template lang="pug">
  q-layout.bg-grey-1(view="hHh lpR fFf")
    q-header.bg-white.text-grey-8(elevated="" height-hint="64")
      q-toolbar.GNL__toolbar
        q-btn.q-mr-sm(flat="" dense="" round="" @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu" icon="menu")
        q-toolbar-title.row.items-center.no-wrap(v-if="$q.screen.gt.xs" shrink="")
            img(src="../statics/scad-logo_v1_100x30.png" clickable="" @click="iconNavigate")
        q-space
        q-input.GNL__toolbar-input(outlined="" dense="" v-model="search" color="bg-grey-7 shadow-1" placeholder="Search for topics, locations & sources")
          template(v-slot:prepend="")
            q-icon(v-if="search === ''" name="search")
            q-icon.cursor-pointer(v-else="" name="clear" @click="search = ''")
          template(v-slot:append="")
            q-btn(flat="" dense="" round="" aria-label="Menu" icon="arrow_drop_down")
              q-menu(anchor="bottom right" self="top right")
                .q-pa-md(style="width: 400px")
                  .text-body2.text-grey.q-mb-md
                    | Narrow your search results
                  .row.items-center
                    .col-3.text-subtitle2.text-grey
                      | Exact phrase
                    .col-9.q-pl-md
                      q-input(dense="" v-model="exactPhrase")
                    .col-3.text-subtitle2.text-grey
                      | Has words
                    .col-9.q-pl-md
                      q-input(dense="" v-model="hasWords")
                    .col-3.text-subtitle2.text-grey
                      | Exclude words
                    .col-9.q-pl-md
                      q-input(dense="" v-model="excludeWords")
                    .col-3.text-subtitle2.text-grey
                      | Website
                    .col-9.q-pl-md
                      q-input(dense="" v-model="byWebsite")
                    .col-12.q-pt-lg.row.justify-end
                      q-btn(flat="" dense="" no-caps="" color="grey-7" size="md" style="min-width: 68px;" label="Search" v-close-popup="")
                      q-btn(flat="" dense="" no-caps="" color="grey-7" size="md" style="min-width: 68px;" @click="onClear" label="Clear" v-close-popup="")
        q-space
        .q-gutter-sm.row.items-center.no-wrap(v-if="tokens.access_token")
          q-btn(v-if="$q.screen.gt.sm" round="" dense="" flat="" color="text-grey-7" icon="apps")
            q-tooltip Google Apps
          q-btn(round="" dense="" flat="" color="grey-8" icon="notifications")
            q-badge(color="red" text-color="white" floating="")
              | 2
            q-tooltip Notifications
          q-btn(round="" flat="")
            q-avatar(size="26px")
              img(src="https://cdn.quasar.dev/img/boy-avatar.png")
            q-tooltip Account
        q-btn(v-else="" round="" color="accent" dense="" icon="supervised_user_circle")
          q-menu(anchor="bottom right" self="top right")
            .q-pa-md(style="width: 400px")
              .text-body1.text-grey-8.q-mb-md
                | Login
              .row.items-center
                .col-3.text-subtitle2.text-grey
                  | Email:
                .col-9.q-pl-md
                  q-input(dense="" v-model="email " :error="$v.email.$error" error-message="Please enter a valid email address")
                .col-3.text-subtitle2.text-grey
                  | Password:
                .col-9.q-pl-md
                  q-input(dense="" v-model="password" :error="$v.password.$error" error-message="Required Field" type="password")
                .col-12.q-pt-lg.row.justify-end
                  q-btn(flat="" dense="" no-caps="" color="grey-7" size="md" style="min-width: 68px;" label="Login" @click="login")
                  q-btn(flat="" dense="" no-caps="" color="red-7" size="md" style="min-width: 68px;" label="Cancel" v-close-popup="")
    q-drawer(v-if="this.loggedIn" v-model="leftDrawerOpen" show-if-above="" bordered="" content-class="bg-white" :width="230")
      q-scroll-area.fit
        q-list.text-grey-8(padding="")
          q-item.GNL__drawer-item(@click="navigate(link.route)" v-ripple="" v-for="link in links1" :key="link.text" clickable="")
            q-item-section(avatar="")
              q-icon(:name="link.icon")
            q-item-section
              q-item-label {{ link.text }}
          q-separator.q-my-sm(inset="")
          q-item.GNL__drawer-item(@click="navigate(link.click)" v-ripple="" v-for="link in links3" :key="link.text" clickable="")
            q-item-section
              q-item-label
                | {{ link.text }}
                q-icon(v-if="link.icon" :name="link.icon")
          .q-mt-md
            .flex.flex-center.q-gutter-xs
              a.GNL__drawer-footer-link(@click="logout" aria-label="Privacy") Logout
              span  ·
              a.GNL__drawer-footer-link(href="javascript:void(0)" aria-label="Terms") Terms
              span  ·
              a.GNL__drawer-footer-link(@click="navigate('register')" aria-label="Register") Register
    q-page-container
      router-view
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
        { icon: '', text: 'My Profile', click: 'my-profile' },
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
    },
    tokens () {
      return this.user.tokens
    }
  },
  methods: {
    navigate: function (nav) {
      console.log('in MyLayout navigate')
      if (nav === 'logout') {
        this.logout()
      } else {
        this.$router.push({
          path: nav
        }).catch(error => {
          if (error.name !== 'NavigationDuplicated') {
            throw error
          }
        })
      }
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
