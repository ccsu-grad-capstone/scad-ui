import Vue from 'vue'
import axios from 'axios'
// import store from '../store'

// const accessToken = store.getters['user/getAccessToken']
// const idToken = store.getters['user/getIdToken']

const scad = axios.create({
  baseURL: 'http://localhost:8080/scadservices/api/'
  // headers: {
  //   'access_token': `${accessToken}`,
  //   'id_token': `${idToken}`,
  //   'Access-Control-Allow-Origin': '*',
  //   'Authorization': 'Basic c2NhZC1hcGktcmVhZHdyaXRlOnNjYWQtYXBpLXJlYWR3cml0ZQ=='
  // }
})

export { scad }

Vue.prototype.$axios = scad
