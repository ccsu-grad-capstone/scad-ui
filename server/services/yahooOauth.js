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
          debug(`yahooGetTokens access_token: ${response.data.access_token}`)
          debug(`yahooGetTokens token_type: ${response.data.token_type}`)
          debug(`yahooGetTokens expires_in: ${response.data.expires_in}`)
          debug(`yahooGetTokens refresh_token: ${response.data.refresh_token}`)
          debug(`yahooGetTokens xoauth_yahoo_guid: ${response.data.xoauth_yahoo_guid}`)
          resolve(response.data)
          // parser.parseString(response.date, (err, result) => {
          //   if (err) {
          //     debug (`parse string error: ${err}`)
          //   } else {
          //     debug (`pars string result: ${result}`)
          //     resolve(result)
          //   }
          // })
        })
        .catch(error => {
          reject(error)
          debug(error.response.data)
        })
    })
  }
  return { getAccessTokens }
}

module.exports = yahooOauth()
