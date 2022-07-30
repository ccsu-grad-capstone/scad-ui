
const routes = [
  {
    path: '/',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/About.vue') }
    ]
  },
  {
    path: '/team/:team_id',
    name: 'team',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/Team.vue') }
    ],
    meta: {
      requiresAuth: true,
      requiresLeague: true
    }
  },
  {
    path: '/draft-picks',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/DraftPicks.vue') }
    ],
    meta: {
      requiresAuth: true,
      requiresLeague: true
    }
  },
  {
    path: '/cap-exemptions',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/CapExemptions.vue') }
    ],
    meta: {
      requiresAuth: true,
      requiresLeague: true
    }
  },
  {
    path: '/league-home',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/LeagueHome.vue') }
    ],
    meta: {
      requiresAuth: true,
      requiresLeague: true
    }
  },
  {
    path: '/dashboard',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/Dashboard.vue') }
    ],
    meta: {
      requiresAuth: true,
      requiresLeague: true
    }
  },
  {
    path: '/players',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/Players.vue') }
    ],
    meta: {
      requiresAuth: true,
      requiresLeague: true
    }
  },
  {
    path: '/league-settings',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/LeagueSettings.vue') }
    ],
    meta: {
      requiresAuth: true,
      requiresLeague: true
    }
  },
  {
    path: '/league-diagnostic',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/LeagueDiagnostics.vue') }
    ],
    meta: {
      requiresAuth: true,
      requiresLeague: true
    }
  },
  {
    path: '/trade',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/Trade.vue') }
    ],
    meta: {
      requiresAuth: true,
      requiresLeague: true
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
    path: '/about',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/About.vue') }
    ]
  },
  {
    path: '/offseason',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/Offseason.vue') }
    ]
  },
  {
    path: '/my-profile',
    name: 'my-profile',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/MyProfile.vue') }
    ],
    meta: {
      requiresAuth: true
      // isAdmin: true
    }
  },
  {
    path: '/commissioner',
    name: 'Commissioner',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/Commissioner.vue') }
    ],
    meta: {
      requiresAuth: true
      // isAdmin: true
    }
  },
  {
    path: '/yahooError',
    name: 'yahooError',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/YahooError.vue') }
    ],
    meta: {
      requiresAuth: true
      // isAdmin: true
    }
  },
  {
    path: '/refresh',
    name: 'refresh',
    component: () => import('../layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../views/YahooRefresh.vue') }
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
