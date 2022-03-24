/* eslint-disable camelcase */
import axios from 'axios'
import { getBaseURL } from '../utilities/enviornment'
// import store from '../store'

const node = axios.create({
  baseURL: getBaseURL('NODE'),
  timeout: 20000,
  headers: {
    Authorization: process.env.VUE_APP_AUTH
  }
})

const nodeHeader = (access_token, id_token) => {
  // let tokens = store.state.user.tokens
  // console.log(tokens)
  return axios.create({
    baseURL: getBaseURL('NODE'),
    timeout: 60000,
    headers: {
      Authorization: process.env.VUE_APP_AUTH,
      accesstoken: access_token,
      idtoken: id_token
    }
  })
}

const aws = axios.create({
  baseURL: 'https://f01asbobv6.execute-api.us-east-1.amazonaws.com/Prod/',
  timeout: 20000
})

const api = (access_token, id_token, refresh_token) => {
  let headers = {
    Authorization: process.env.VUE_APP_AUTH,
    access_token: access_token,
    id_token: id_token,
    refresh_token: refresh_token
  }
  // if (refresh_token) headers.refresh_token = refresh_token
  return axios.create({
    baseURL: `${process.env.VUE_APP_API}/`,
    timeout: 60000,
    headers: headers
  })
}

export { node, nodeHeader, aws, api }
