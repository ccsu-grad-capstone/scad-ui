import notify from './nofity'

const catchAxiosError = (error) => {
  console.error(error)
  if (error.response.data) {
    notify.genericServerIssueWithResponse(error.response.data)
  } else {
    notify.genericServerIssue()
  }
}

const catchAxiosNodeError = (error) => {
  console.error(error)
  if (error.response.data) {
    notify.nodeServerIssueWithResponse(error.response.data)
  } else {
    notify.nodeServerIssue()
  }
}

export { catchAxiosError, catchAxiosNodeError }
