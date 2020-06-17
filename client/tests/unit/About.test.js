/* eslint-disable no-undef */
import Vuex from 'vuex'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import About from '@/views/About'
import user from '@/store/modules/user'

const localVue = createLocalVue()
localVue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user: user
  }

})

describe('About', () => {
  it('renders a username using a real Vuex store', () => {
    const wrapper = shallowMount(About, {
      store,
      localVue
    })

    expect(wrapper.find('.loggedIn')).toBeFalsy()
  })
})
