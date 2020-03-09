
const routes = [
  {
    path: '/',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/Index.vue') }
    ]
  },
  {
    path: '/team:team_key',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/Team.vue') }
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/draft-picks',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/DraftPicks.vue') }
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/league-home',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/LeagueHome.vue') }
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/dashboard',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/Dashboard.vue') }
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/free-agents',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/FreeAgents.vue') }
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/league-settings',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/LeagueSettings.vue') }
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/register-league',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/RegisterLeague.vue') }
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/trade',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/Trade.vue') }
    ],
    meta: {
      requiresAuth: true
    }
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
    ],
    meta: {
      requiresAuth: true
      // isAdmin: true
    }
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
