<template lang="pug">
  q-layout.bg-grey-2(view="hHh LpR fFf")
    q-header.bg-white.text-grey-8(elevated height-hint="64")
      q-toolbar.GNL__toolbar
        q-btn.q-mr-sm(v-if="loggedIn" flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu" icon="menu")
        q-toolbar-title.row.items-center.no-wrap(v-if="$q.screen.gt.xs" shrink)
          img(src="../statics/scad-logo_v1_100x30.png" clickable @click="iconNavigate")
        q-toolbar-title.row.items-center.no-wrap(v-else shrink)
          .text-h5.text-primary.text-weight-bolder SCAD
        q-space
        .q-gutter-sm.row.items-center.no-wrap(v-if="tokens.access_token")
          .text-weight-bold.text-body1.gt-sm Welcome {{ user.user.given_name }}
          q-btn(round flat @click="navigate('my-profile')")
            q-avatar(size="40px")
              img(v-if="loaded" :src="getProfilePic()")
        q-btn(v-else label="Log In" flat color="primary" size="md" @click="loginWithYahoo")
    q-drawer(v-if="this.loggedIn" v-model="leftDrawerOpen" :breakpoint="1200" show-if-above bordered content-class="bg-white" :width="245" elevated)
      q-scroll-area.fit
        q-list.text-grey-8(padding)
          q-item.justify-center
            .col(v-if="loaded")
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
      .row.full-width(v-if="!loaded")
        .row.full-width.justify-center
          q-circular-progress.q-mt-xl(
            indeterminate
            size="90px"
            :thickness="0.2"
            color="primary"
            center-color="grey-5"
            track-color="transparent"
            class="q-ma-md"
            )
        .row.full-width.justify-center
          .text-grey Updating SCAD with latest Yahoo info...
      div(v-else)
        router-view
    q-footer.row.q-pa-sm.bg-grey-2.footer
      .col
        .text-grey-6.text-center Copyright 2020
      .col
        .text-grey-6.text-center
      .col
        .text-grey-6.text-center Version {{ p.version }}

</template>

<script>
/* eslint-disable eqeqeq */
import { getBaseURL } from '../utilities/enviornment'
import p from '../../package.json'

export default {
  name: 'DefaultLayout',

  data () {
    return {
      loaded: false,
      leftDrawerOpen: true,
      showDateOptions: false,
      activeLeague: '',
      hasLeagueLinks: [
        { icon: 'dashboard', text: 'Dashboard', route: '/dashboard' },
        // { icon: 'list', text: 'My Team', route: `team/1` },
        { icon: 'list', text: `My Team`, route: `/team` },
        { icon: 'ballot', text: 'Draft Picks', route: '/draft-picks' },
        { icon: 'swap_horizontal_circle', text: 'Cap Exemptions', route: '/cap-exemptions' },
        { icon: 'people', text: 'Players', route: '/players' },
        // { icon: 'home', text: 'League Home', route: 'league-home' },
        {
          icon: 'settings_applications',
          text: 'League Settings',
          route: '/league-settings'
        }
      ],
      noLeagueLinks: [
        { icon: 'dashboard', text: 'Dashboard', route: 'dashboard' }
      ],
      links3: [
        { icon: '', text: 'My Profile', click: '/my-profile' },
        { icon: '', text: 'Register League', click: '/register-league' },
        { icon: '', text: 'About', click: '/about' },
        { icon: 'logout', text: 'Logout', click: 'logout' }
      ]
    }
  },
  created () {
    this.persistState()
  },
  computed: {
    p () {
      return p
    },
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
    scadLeagueId () {
      return this.league.scadLeagueId
    },
    scadLeagues () {
      return this.league.scadLeagues
    },
    yahooLeagues () {
      return this.league.yahooLeagues
    },
    myYahooTeamId () {
      return this.$store.state.team.myYahooTeamId
    },
    filteredLeagues () {
      return this.scadLeagues.map(l => Object.assign({}, l, { value: l.yahooLeagueId, label: this.getLeagueName(l.yahooLeagueId) }))
    }
  },
  methods: {
    navigate: function (nav) {
      if (nav === 'logout') {
        this.logout()
      } else if (nav === '/team') {
        this.$router.push({ path: `/team/${this.myYahooTeamId}` })
          .catch(error => {
            if (error.name !== 'NavigationDuplicated') {
              throw error
            }
          })
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
      // console.log('[LAYOUT] - persistState()')
      this.$q.loadingBar.setDefaults({
        color: 'primary',
        size: '4px',
        position: 'top'
      })
      this.$q.loadingBar.start()
      // console.log('[LAYOUT] - checkForTokens()')
      if (this.$route.query.access_token) {
        console.log('New Tokens - Update Cookies w/ Tokens')
        this.$cookies.set('access_token', this.$route.query.access_token)
        this.$cookies.set('id_token', this.$route.query.id_token)
        this.$cookies.set('refresh_token', this.$route.query.refresh_token)
      } else {
        console.log('No Tokens in Query Params..')
      }

      // console.log('[LAYOUT] - refreshStateWithCookies()')
      if (this.$cookies.isKey('access_token') && !this.tokens.access_token) {
        console.log('Access_Token is stored in cookies but not in store - Refresh Token and Update Store')
        const tokens = {
          access_token: this.$cookies.get('access_token'),
          refresh_token: this.$cookies.get('refresh_token'),
          id_token: this.$cookies.get('id_token')
        }
        try {
          await this.$store.commit('user/updateTokens', tokens)
          await this.$store.dispatch('user/refreshToken')
          await this.$store.dispatch('user/updateUser')
          // await this.$store.dispatch('league/getAllScadLeagues')
          await this.$store.dispatch('league/dashboard')
        } catch (error) {
          console.log('SERVER ISSUE, please try again shortly.')
        }
        // this.$store.dispatch('team/getMyYahooTeam', '22351')
      }
      if (this.$route.query) {
        history.pushState(null, '', location.href.split('?')[0])
      }
      // if (this.league.key !== 'League') {
      //   console.log('redirecting to about..layout', this.league.key)
      //   this.$router.push('about')
      // }
      this.activeLeague = this.league.yahooLeagueDetails.name
      this.loaded = true
      this.$q.loadingBar.stop()
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
      this.loaded = false
      console.log('[LAYOUT] - switchLeagues()')
      console.log('ActiveLeague', this.activeLeague)
      await this.$store.dispatch('league/switchLeagues', this.activeLeague.yahooLeagueId)
      this.navigate('/dashboard')
      this.loaded = true
    },
    iconNavigate () {
      if (this.loggedIn && this.league.isActive) {
        this.navigate('/dashboard')
      } else {
        this.navigate('/')
      }
    },
    getProfilePic () {
      return this.user.user.profile_images.image64
    },
    leagueIsActiveToggle () {
      this.$store.commit('league/leagueIsActiveToggle')
    },
    loginWithYahoo () {
      console.log('[LAYOUT] - loginWithYahoo()')
      this.$cookies.keys().forEach(cookie => this.$cookies.remove(cookie))
      window.location = `${getBaseURL('NODE')}/auth/yahoo`
    },
    getLeagueName (id) {
      let league = this.yahooLeagues.find(l => l.league_id == id)
      if (league) return league.name
    }
  }
}
</script>

<style lang="sass">
.footer
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: red;
  color: white;
  text-align: center;

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
