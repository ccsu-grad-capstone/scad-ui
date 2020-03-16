/* eslint-disable camelcase */
import axios from 'axios'

const scad = (access_token, id_token) => {
  return axios.create({
    baseURL: 'http://localhost:8080/scadservices/api/',
    timeout: 1500,
    headers: {
      'access_token': access_token,
      'id_token': id_token,
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Basic c2NhZC1hcGktcmVhZHdyaXRlOnNjYWQtYXBpLXJlYWR3cml0ZQ=='
    }
  })
}

export { scad }
