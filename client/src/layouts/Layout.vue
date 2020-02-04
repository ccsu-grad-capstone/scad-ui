<template lang="pug">
  q-layout.bg-grey-1(view="hHh lpR fFf")
    q-header.bg-white.text-grey-8(elevated="" height-hint="64")
      q-toolbar.GNL__toolbar
        q-btn.q-mr-sm(flat="" dense="" round="" @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu" icon="menu")
        q-toolbar-title.row.items-center.no-wrap(v-if="$q.screen.gt.xs" shrink="")
            img(src="../statics/scad-logo_v1_100x30.png" clickable="" @click="iconNavigate")
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
