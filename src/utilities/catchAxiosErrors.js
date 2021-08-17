import notify from './nofity'

const catchAxiosError = (error) => {
  console.error(error)
  if (error.response && error.response.data) {
    if (error.response.data.includes('html')) {
      notify.error('Session has ended. Please login again.')
    } else {
      notify.genericServerIssueWithResponse(error.response.data)
    }
  } else {
    notify.genericServerIssue()
  }
}

const catchAxiosNodeError = (error) => {
  console.error(error)
  if (error.response && error.response.data) {
    if (error.response.data.includes('html')) {
      notify.error('Session has ended. Please login again.')
    } else {
      notify.nodeServerIssueWithResponse(error.response.data)
    }
  } else {
    notify.nodeServerIssue()
  }
}

export { catchAxiosError, catchAxiosNodeError }
