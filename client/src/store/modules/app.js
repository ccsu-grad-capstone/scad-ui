import { server } from '../../utilities/axios-server'

export default {
  namespaced: true,
  state: {
    appName: 'SCAD: Salary Cap Dynasty Fantasy Fooball'
  },
  getters: {
  },
  actions: {
    loginWithYahoo (state, commit) {
      console.log('[USER-MUTATION] - loginWithYahoo()')
      return server.post('https://api.login.yahoo.com/oauth2/request_auth', {
        client_id: 'dj0yJmk9dG5YTU9UMHBpQWJ6JmQ9WVdrOWVFMWxWbk5yTlRBbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTgz',
        redirect_uri: '/auth/github/redirect',
        response_type: 'code',
        scope: 'openid fspt-w',
        nonce: 'nonce=YihsFwGKgt3KJUh6tPs2'
      })
    }
  },
  mutations: {
  }
}
