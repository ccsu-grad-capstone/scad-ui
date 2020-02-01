const axios = require('axios')
const xml2js = require('xml2js')
const debug = require('debug')('app:yahooOauth')

var parser = xml2js.Parser({ explicitArray: false })

function yahooOauth() {
  function getTokens(code) {
    var postData = {
      grant_type: 'authorization_code',
      redirect_uri: 'https://localhost:3000/auth/yahoo/redirect',
      code: 'sc9jyt7'
    }

    let axiosConfig = {
      headers: {
        'Authorization':
          'Basic ZGoweUptazlhV3RaV2pKWFdWVjNhMlF5Sm1ROVdWZHJPVlpXVWxCa1NFWjZUbGRWYldOSGJ6bE5RUzB0Sm5NOVkyOXVjM1Z0WlhKelpXTnlaWFFtYzNZOU1DWjRQVGc1OjdlNjQ3NzdiODlhOTljMzA2Y2I5MjJkYzJkMmVmOTFhNDI0ZjYwMzI=',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    const options = {
      method: 'POST',
      headers: { 
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization':
        'Basic ZGoweUptazlhV3RaV2pKWFdWVjNhMlF5Sm1ROVdWZHJPVlpXVWxCa1NFWjZUbGRWYldOSGJ6bE5RUzB0Sm5NOVkyOXVjM1Z0WlhKelpXTnlaWFFtYzNZOU1DWjRQVGc1OjdlNjQ3NzdiODlhOTljMzA2Y2I5MjJkYzJkMmVmOTFhNDI0ZjYwMzI='},
      data: `grant_type=authorization_code&redirect_uri=https://localhost:3000/auth/yahoo/redirect&code=${code}`,
      url: 'https://api.login.yahoo.com/oauth2/get_token'
    }

    // debug(`oauth data: ${data.client_secret}`)
    // console.log(`oauth data: ${data}`)
    return new Promise((resolve, reject) => {
      // axios.post(`https://api.login.yahoo.com/oauth2/get_token?grant_type=authorization_code&redirect_uri=https://localhost:3000/auth/yahoo/redirect&code=${code}`, axiosConfig)
      // axios.post(`https://api.login.yahoo.com/oauth2/get_token`,
      //     {
      //       grant_type: 'authorization_code',
      //       redirect_uri: 'https://localhost:3000/auth/yahoo/redirect',
      //       code: code
      //     },
      //     axiosConfig
      //   )
      axios(options)
        .then(response => {
          console.log(`yahooOauth access_token: ${JSON.stringify(response.data.access_token)}`)
          console.log(`yahooOauth token_type: ${response.data.token_type}`)
          console.log(`yahooOauth expires_in: ${response.data.expires_in}`)
          console.log(`yahooOauth refresh_token: ${response.data.refresh_token}`)
          console.log(`yahooOauth xoauth_yahoo_guid: ${response.data.xoauth_yahoo_guid}`)
          // parser.parseString(response.data, (err, result) => {
          //   if (err) {
          //     debug(err)
          //   } else {
          //     debug(result)
          //     resolve(result.yahooOauth.token) //might have to change this reslove value based on response
          //   }
          // })
        })
        .catch(error => {
          reject(error)
          debug(error.response.data)
        })
    })
  }
  return { getTokens }
}

module.exports = yahooOauth()
