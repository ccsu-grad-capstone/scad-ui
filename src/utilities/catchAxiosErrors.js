import notify from './nofity'
import router from '../router'

const catchAxiosError = (error) => {
  if (error.response && error.response.data) {
    console.error(error.response)
    if (error.response.data.yahooConnectionIssue) {
      console.log('re-routing to yahooError.vue')
      router.push('/yahooError')
    } else if (JSON.stringify(error.response.data).includes('html')) {
      notify.error('Session has ended. Please login again.')
      router.push('/about')
    } else if (JSON.stringify(error.response.data).includes('Getting Draft Picks')) {
      console.log('Getting Draft Picks Error')
    } else if (JSON.stringify(error.response.data).includes('An Error Occur')) {
      router.push('/refresh')
    }
  } else {
    console.error(error)
    // notify.nodeServerIssue()
    router.push('/refresh')
  }
}

export { catchAxiosError }
