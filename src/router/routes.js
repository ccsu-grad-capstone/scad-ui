
const routes = [
  {
    path: '/',
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  },
  {
    path: '/register',
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('pages/RegisterUser.vue') }
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') }
    ]
  },
  {
    path: '/my-team',
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('pages/MyTeam.vue') }
    ]
  },
  {
    path: '/league-home',
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('pages/LeagueHome.vue') }
    ]
  },
  {
    path: '/dashboard',
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('pages/Dashboard.vue') }
    ]
  },
  {
    path: '/free-agents',
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('pages/FreeAgents.vue') }
    ]
  },
  {
    path: '/league-settings',
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('pages/LeagueSettings.vue') }
    ]
  },
  {
    path: '/create-league',
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('pages/CreateLeague.vue') }
    ]
  },
  {
    path: '/matchup',
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('pages/Matchup.vue') }
    ]
  },
  {
    path: '/about',
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('pages/About.vue') }
    ]
  },
  {
    path: '/my-profile',
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('pages/MyProfile.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
