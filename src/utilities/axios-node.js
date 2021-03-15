/* eslint-disable camelcase */
import axios from 'axios'
import { getBaseURL } from '../utilities/enviornment'
// import store from '../store'

const node = axios.create({
  baseURL: getBaseURL('NODE'),
  timeout: 20000,
  headers: {
    'Authorization': 'Basic dXNlcjpub2RlLWFwaS1yZWFkd3JpdGU='
  }
})

const nodeHeader = (access_token, id_token) => {
  // let tokens = store.state.user.tokens
  // console.log(tokens)
  console.log('NODE URL', getBaseURL('NODE'))
  console.log('process.env.VUE_APP_UI_PROD', process.env.VUE_APP_NODE_DEV)
  return axios.create({
    baseURL: getBaseURL('NODE'),
    timeout: 30000,
    headers: {
      'Authorization': 'Basic dXNlcjpub2RlLWFwaS1yZWFkd3JpdGU=',
      'access_token': access_token,
      'id_token': id_token
    }
  })
}

const aws = axios.create({
  baseURL: 'https://f01asbobv6.execute-api.us-east-1.amazonaws.com/Prod/',
  timeout: 20000
})

const awsHeader = (access_token, id_token) => {
  return axios.create({
    baseURL: 'https://f01asbobv6.execute-api.us-east-1.amazonaws.com/Prod/',
    timeout: 20000,
    headers: {
      'Authorization': 'Basic dXNlcjpub2RlLWFwaS1yZWFkd3JpdGU=',
      'access_token': access_token,
      'id_token': id_token
    }
  })
}

export { node, nodeHeader, aws, awsHeader }
