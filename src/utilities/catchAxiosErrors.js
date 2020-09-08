import notify from './nofity'

const catchAxiosError = (error) => {
  if (error.response) {
    notify.genericServerIssueWithResponse(error.response.status, error.message)
    console.log(error.response)
  } else if (error.request) {
    notify.genericServerIssue(error.message)
    console.log(error.request)
  } else {
    notify.genericServerIssue(error.message)
    console.log('Error', error.message)
  }
  console.log(error)
}

const catchAxiosScadError = (error) => {
  if (error.response) {
    notify.scadServerIssueWithResponse(error.response.status, error.message)
    console.log(error.response)
  } else if (error.request) {
    if (error.message.includes('timeout of')) {
      notify.scadTimeoutIssue()
    } else {
      notify.scadServerIssue(error.message)
    }
    console.log(error.request)
  } else {
    notify.scadServerIssue(error.message)
    console.log('Error', error.message)
  }
  console.log(error)
}

const catchAxiosNodeError = (error) => {
  if (error.response) {
    notify.nodeServerIssueWithResponse(error.response.status, error.message)
    console.log(error.response)
  } else if (error.request) {
    notify.nodeServerIssue(error.message)
    console.log(error.request)
  } else {
    notify.nodeServerIssue(error.message)
    console.log('Error', error.message)
  }
  console.log(error)
}

export { catchAxiosError, catchAxiosScadError, catchAxiosNodeError }
