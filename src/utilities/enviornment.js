
const inDevelopment = () => process.env.NODE_ENV === 'development'

const inProduction = () => process.env.NODE_ENV === 'production'

const getBaseURL = (api) => {
  if (inDevelopment()) {
    let endpoint = `VUE_APP_${api}_DEV`
    return process.env[endpoint]
  } else if (inProduction()) {
    let endpoint = `VUE_APP_${api}_PROD`
    return `process.env.${endpoint}`
  } else {
    console.log('ENVIORNMENT ERROR')
  }
}

export { inDevelopment, inProduction, getBaseURL }
