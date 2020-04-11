import Vue from 'vue'
import axios from 'axios'

const server = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 8000
})

export { server }

Vue.prototype.$axios = server
