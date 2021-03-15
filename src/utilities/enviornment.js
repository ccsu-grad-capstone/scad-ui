
const inDevelopment = () => process.env.NODE_ENV === 'development'

const inProduction = () => process.env.NODE_ENV === 'production'

const getBaseURL = (api) => {
  if (inDevelopment()) {
    console.log('inDevelopment')
    let endpoint = `VUE_APP_${api}_DEV`
    console.log('returning', endpoint)
    return process.env[endpoint]
  } else if (inProduction()) {
    console.log('inProduction')
    let endpoint = `VUE_APP_${api}_PROD`
    console.log('returning', endpoint)
    return process.env[endpoint]
  } else {
    console.log('ENVIORNMENT ERROR')
  }
}

export { inDevelopment, inProduction, getBaseURL }
