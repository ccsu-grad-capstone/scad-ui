const axios = require('axios')
const xml2js = require('xml2js')
const debug = require('debug')('app:yahooOauth')

var parser = xml2js.Parser({ explicitArray: false })

function yahooOauth() {
  function getAccessTokens(code) {
    const options = {
      method: 'POST',
      headers: { 
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization':
        'Basic ZGoweUptazlhV3RaV2pKWFdWVjNhMlF5Sm1ROVdWZHJPVlpXVWxCa1NFWjZUbGRWYldOSGJ6bE5RUzB0Sm5NOVkyOXVjM1Z0WlhKelpXTnlaWFFtYzNZOU1DWjRQVGc1OjdlNjQ3NzdiODlhOTljMzA2Y2I5MjJkYzJkMmVmOTFhNDI0ZjYwMzI='},
      data: `grant_type=authorization_code&redirect_uri=https://localhost:3000/auth/yahoo/redirect&code=${code}`,
      url: 'https://api.login.yahoo.com/oauth2/get_token'
    }
    return new Promise((resolve, reject) => {
      axios(options)
        .then(response => {
          resolve(response.data)
          if (response.status === 200) {
            resolve(response.data)
          } else {
            reject(response.status)
            debug(response.status)
          }
        })
        .catch(error => {
          reject(error)
          debug(error.response.data)
        })
    })
  }
  function refreshToken(refresh_token) {
    const options = {
      method: 'POST',
      headers: { 
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization':
        'Basic ZGoweUptazlhV3RaV2pKWFdWVjNhMlF5Sm1ROVdWZHJPVlpXVWxCa1NFWjZUbGRWYldOSGJ6bE5RUzB0Sm5NOVkyOXVjM1Z0WlhKelpXTnlaWFFtYzNZOU1DWjRQVGc1OjdlNjQ3NzdiODlhOTljMzA2Y2I5MjJkYzJkMmVmOTFhNDI0ZjYwMzI='},
      data: `grant_type=refresh_token&redirect_uri=https://localhost:3000/auth/yahoo/refresh&refresh_token=${refresh_token}`,
      url: 'https://api.login.yahoo.com/oauth2/get_token'
    }
    return new Promise((resolve, reject) => {
      axios(options)
        .then(response => {
          resolve(response.data)
          if (response.status === 200) {
            resolve(response.data)
          } else {
            reject(response.status)
            debug(response.status)
          }
        })
        .catch(error => {
          reject(error)
          debug(error.response.data)
        })
    })
  }
  return { getAccessTokens, refreshToken }
}

module.exports = yahooOauth()
