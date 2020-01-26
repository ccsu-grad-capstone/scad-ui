
const routes = [
  {
    path: '/',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/Index.vue') }
    ]
  },
  {
    path: '/register',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/RegisterUser.vue') }
    ]
  },
  {
    path: '/login',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/Login.vue') }
    ]
  },
  {
    path: '/my-team',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/MyTeam.vue') }
    ]
  },
  {
    path: '/league-home',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/LeagueHome.vue') }
    ]
  },
  {
    path: '/dashboard',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/Dashboard.vue') }
    ]
  },
  {
    path: '/free-agents',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/FreeAgents.vue') }
    ]
  },
  {
    path: '/league-settings',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/LeagueSettings.vue') }
    ]
  },
  {
    path: '/create-league',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/CreateLeague.vue') }
    ]
  },
  {
    path: '/matchup',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/Matchup.vue') }
    ]
  },
  {
    path: '/about',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/About.vue') }
    ]
  },
  {
    path: '/my-profile',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/MyProfile.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('../views/Error404.vue')
  })
}

export default routes
