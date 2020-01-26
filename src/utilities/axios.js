import Vue from 'vue'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/scadservices/api/'
})

export { api }

Vue.prototype.$axios = api
