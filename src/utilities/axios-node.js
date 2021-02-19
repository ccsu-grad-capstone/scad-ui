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

const nodeHeader = (access_token) => {
  return axios.create({
    baseURL: getBaseURL('NODE'),
    timeout: 20000,
    headers: {
      'Authorization': 'Basic dXNlcjpub2RlLWFwaS1yZWFkd3JpdGU=',
      'access_token': access_token
    }
  })
}

const aws = axios.create({
  baseURL: 'https://f01asbobv6.execute-api.us-east-1.amazonaws.com/Prod/',
  timeout: 20000
})

const awsHeader = (access_token) => {
  return axios.create({
    baseURL: 'https://f01asbobv6.execute-api.us-east-1.amazonaws.com/Prod/',
    timeout: 20000,
    headers: {
      'access_token': access_token
    }
  })
}

export { node, nodeHeader, aws, awsHeader }
