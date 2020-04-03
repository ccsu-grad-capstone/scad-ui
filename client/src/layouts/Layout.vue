<template lang="pug">
  q-layout.bg-grey-1(view="hHh LpR fFf")
    q-header.bg-white.text-grey-8(elevated height-hint="64")
      q-toolbar.GNL__toolbar
        q-btn.q-mr-sm(flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu" icon="menu")
        q-toolbar-title.row.items-center.no-wrap(v-if="$q.screen.gt.xs" shrink)
            img(src="../statics/scad-logo_v1_100x30.png" clickable @click="iconNavigate")
        q-space
        q-item
          q-item-section
            q-item-label
              | league.isActive
              q-toggle(v-model="league.isActive")
        .q-gutter-sm.row.items-center.no-wrap(v-if="tokens.access_token")
          .text-weight-bold.text-body1 Welcome, {{ user.user.givenName }}
          q-btn(round flat @click="navigate('my-profile')")
            q-avatar(size="40px")
              img(:src="getProfilePic()")
            q-tooltip Account
    q-drawer(v-if="this.loggedIn" v-model="leftDrawerOpen" show-if-above bordered content-class="bg-white" :width="230" elevated)
      q-scroll-area.fit
        q-list.text-grey-8(padding)
          q-item.justify-center
            .col
              q-select( filled dense label="League" v-model='activeLeague' :options='filteredLeagues' @input="switchLeagues()")
          q-item.GNL__drawer-item(@click="navigate(link.route)" v-if="league.isActive" v-ripple v-for="link in hasLeagueLinks" :key="link.text" clickable)
            q-item-section(avatar)
              q-icon(:name="link.icon")
            q-item-section
              q-item-label {{ link.text }}
          q-separator.q-my-sm(v-if="league.isActive" inset)
          q-item.GNL__drawer-item(@click="navigate(link.click)" v-ripple v-for="link in links3" :key="link.text" clickable)
            q-item-section
              q-item-label
                | {{ link.text }}
                q-icon(v-if="link.icon" :name="link.icon")
    q-page-container
      div
        router-view(v-if="loaded")
</template>

<script>

export default {
  name: 'DefaultLayout',

  data () {
    return {
      loaded: false,
      leftDrawerOpen: true,
      showDateOptions: false,
      activeLeague: 'Please Register Below',
      hasLeagueLinks: [
        { icon: 'dashboard', text: 'Dashboard', route: 'dashboard' },
        { icon: 'list', text: 'My Team', route: 'team:my-team' },
        { icon: 'ballot', text: 'Draft Picks', route: 'draft-picks' },
        { icon: 'people', text: 'Players', route: 'players' },
        // { icon: 'home', text: 'League Home', route: 'league-home' },
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
  async created () {
    await this.persistState()
    this.loaded = true
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    loggedIn () {
      return this.user.active
    },
    tokens () {
      return this.user.tokens
    },
    league () {
      return this.$store.state.league
    },
    scadLeagues () {
      return this.league.scadLeagues
    },
    filteredLeagues () {
      return this.scadLeagues.map(l => Object.assign({}, l, { value: l.yahooLeagueId, label: l.yahooLeagueId }))
    }
  },
  methods: {
    navigate: function (nav) {
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

    async persistState () {
      console.log('[LAYOUT] - persistState()')

      console.log('[LAYOUT] - checkForTokens()')
      if (this.$route.query.access_token) {
        console.log('New Tokens - Update Cookies w/ Tokens')
        this.$cookies.set('access_token', this.$route.query.access_token)
        this.$cookies.set('id_token', this.$route.query.id_token)
        this.$cookies.set('refresh_token', this.$route.query.refresh_token)
      } else {
        console.log('No Tokens in Query Params..')
      }

      console.log('[LAYOUT] - refreshStateWithCookies()')
      if (this.$cookies.isKey('access_token') && !this.tokens.access_token) {
        console.log('Access_Token is stored in cookies but not in store - Refresh Token and Update Store')
        const tokens = {
          access_token: this.$cookies.get('access_token'),
          refresh_token: this.$cookies.get('refresh_token'),
          id_token: this.$cookies.get('id_token')
        }
        await this.$store.commit('user/updateTokens', tokens)
        await this.$store.dispatch('user/refreshToken')
        await this.$store.dispatch('user/updateUser')
        await this.$store.dispatch('user/loginToScad')
      }
      if (this.$route.query) {
        history.pushState(null, '', location.href.split('?')[0])
      }
    },
    async logout () {
      console.log('[LAYOUT] - logout()')
      this.$cookies.keys().forEach(cookie => this.$cookies.remove(cookie))
      this.$store.commit('user/logoutUser')
      this.$store.commit('league/logoutLeague')
      this.$store.commit('team/logoutTeam')
      this.$store.commit('player/logoutPlayer')
      // eslint-disable-next-line handle-callback-err
      this.$router.push('/').catch(error => {
        if (error.name !== 'NavigationDuplicated') {
          throw error
        }
      })
    },
    async switchLeagues () {
      console.log('[LAYOUT] - switchLeagues()')
      console.log(this.activeLeague)
      await this.$store.dispatch('league/switchLeagues', this.activeLeague)
      this.navigate('/dashboard')
    },
    iconNavigate () {
      if (this.loggedIn && this.league.isActive) {
        this.navigate('dashboard')
      } else {
        this.navigate('/')
      }
    },
    getProfilePic () {
      console.log('[LAYOUT] - getProfilePic()')
      if (this.loaded) {
        return this.user.user.profileImages.image64
      }
    },
    leagueIsActiveToggle () {
      this.$store.commit('league/leagueIsActiveToggle')
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
