import Vue from 'vue'
import axios from 'axios'

const scad = axios.create({
  baseURL: 'http://localhost:8080/scadservices/api/'
})

export { scad }

Vue.prototype.$axios = scad
