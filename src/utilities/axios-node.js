import Vue from 'vue'
import axios from 'axios'

const node = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 8000,
  headers: {
    'Authorization': 'Basic dXNlcjpub2RlLWFwaS1yZWFkd3JpdGU='
  }
})

export { node }

Vue.prototype.$axios = node
