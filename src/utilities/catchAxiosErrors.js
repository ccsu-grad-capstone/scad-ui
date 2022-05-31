import notify from './nofity'
import router from '../router'

const catchAxiosError = (error) => {
  if (error.response && error.response.data) {
    console.error(error.response)
    if (JSON.stringify(error.response.data).includes('html')) {
      notify.error('Session has ended. Please login again.')
    } else if (error.response.data.message) {
      notify.nodeServerIssueWithResponse(error.response.data.message)
    } else {
      notify.error('Error Retrieving SCAD info. Please try again shortly.')
    }
    if (error.response.data.yahooConnectionIssue) {
      console.log('re-routing to yahooError.vue')
      router.push('/yahooError')
    }
  } else {
    console.error(error)
    notify.nodeServerIssue()
  }
}

export { catchAxiosError }
