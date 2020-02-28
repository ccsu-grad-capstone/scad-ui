<template lang="pug">
  q-layout.bg-grey-1(view="hHh LpR fFf")
    q-header.bg-white.text-grey-8(elevated height-hint="64")
      q-toolbar.GNL__toolbar
        q-btn.q-mr-sm(flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu" icon="menu")
        q-toolbar-title.row.items-center.no-wrap(v-if="$q.screen.gt.xs" shrink)
            img(src="../statics/scad-logo_v1_100x30.png" clickable @click="iconNavigate")
        q-space
        .q-gutter-sm.row.items-center.no-wrap(v-if="tokens.access_token")
          q-btn(v-if="$q.screen.gt.sm" round dense flat color="text-grey-7" icon="apps")
            q-tooltip Google Apps
          q-btn(round dense flat color="grey-8" icon="notifications")
            q-badge(color="red" text-color="white" floating)
              | 2
            q-tooltip Notifications
          q-btn(round flat)
            q-avatar(size="26px")
              img(:src="getProfilePic()")
            q-tooltip Account
    q-drawer(v-if="this.loggedIn" v-model="leftDrawerOpen" show-if-above bordered content-class="bg-white" :width="230" elevated)
      q-scroll-area.fit
        q-list.text-grey-8(padding)
          q-item.justify-center
            q-avatar(size="25px")
              img(src="../statics/yahoo-ff.png")
            q-item-section
              q-item-label.q-pl-sm  {{league.league.name}}
          q-item.GNL__drawer-item(@click="navigate(link.route)" v-if="Object.keys(league.league).length !== 0" v-ripple v-for="link in hasLeagueLinks" :key="link.text" clickable)
            q-item-section(avatar)
              q-icon(:name="link.icon")
            q-item-section
              q-item-label {{ link.text }}
          q-separator.q-my-sm(inset)
          q-item.GNL__drawer-item(@click="navigate(link.click)" v-ripple v-for="link in links3" :key="link.text" clickable)
            q-item-section
              q-item-label
                | {{ link.text }}
                q-icon(v-if="link.icon" :name="link.icon")
    q-page-container
      router-view
</template>

<script>

export default {
  name: 'DefaultLayout',

  data () {
    return {
      leftDrawerOpen: true,
      showDateOptions: false,
      hasLeagueLinks: [
        { icon: 'dashboard', text: 'Dashboard', route: 'dashboard' },
        { icon: 'list', text: 'My Team', route: 'team:my-team' },
        { icon: 'ballot', text: 'Draft Picks', route: 'draft-picks' },
        { icon: 'people', text: 'Free Agents', route: 'free-agents' },
        { icon: 'home', text: 'League Home', route: 'league-home' },
        {
          icon: 'settings_applications',
          text: 'League Settings',
          route: 'league-settings'
        }
      ],
      noLeagueLinks: [
        { icon: 'dashboard', text: 'Dashboard', route: 'dashboard' }
      ],
      links3: [
        { icon: '', text: 'My Profile', click: 'my-profile' },
        { icon: '', text: 'Register League', click: 'register-league' },
        { icon: '', text: 'About', click: 'about' },
        { icon: 'logout', text: 'Logout', click: 'logout' }
      ]
    }
  },
  created () {
    this.persistState()
  },
  computed: {
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
    },
    league () {
      return this.$store.state.league
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
    persistState () {
      console.log('[LAYOUT] - checkCookies()')
      this.checkForTokens()
      this.refreshStateWithCookies()
      if (this.$route.query) {
        history.pushState(null, '', location.href.split('?')[0])
      }
    },
    checkForTokens () {
      console.log('[LAYOUT] - checkForTokens()')
      if (this.$route.query.access_token) {
        console.log('New Tokens - Update Vuex and Cookies')
        const tokens = {
          access_token: this.$route.query.access_token,
          refresh_token: this.$route.query.refresh_token,
          id_token: this.$route.query.id_token
        }
        this.$cookies.set('access_token', tokens.access_token)
        this.$cookies.set('id_token', tokens.id_token)
        this.$cookies.set('refresh_token', tokens.refresh_token)
        this.$store.dispatch('user/refreshStateWithCookies', tokens)
      } else {
        console.log('No Tokens in Query Params..')
      }
    },
    async refreshStateWithCookies () {
      console.log('[LAYOUT] - refreshStateWithCookies()')
      if (this.$cookies.isKey('access_token') && !this.tokens.access_token) {
        console.log('Access_Token is stored in cookies but not in store')
        const tokens = {
          access_token: this.$cookies.get('access_token'),
          refresh_token: this.$cookies.get('refresh_token'),
          id_token: this.$cookies.get('id_token')
        }
        await this.$store.dispatch('user/refreshStateWithCookies', tokens)
      }
    },
    logout () {
      console.log('[LAYOUT] - logout()')
      this.$cookies.keys().forEach(cookie => this.$cookies.remove(cookie))
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
    },
    getProfilePic () {
      console.log('[LAYOUT] - getProfilePic()')
      return this.user.user.profileImages.image64
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
