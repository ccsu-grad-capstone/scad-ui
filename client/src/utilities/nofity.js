import { Notify } from 'quasar'

export default {
  loginFailed () {
    Notify.create({
      message: 'Login Failed',
      position: 'top',
      color: 'red'
    })
  },
  loginSuccessful () {
    Notify.create({
      message: 'Login Successful',
      position: 'top',
      color: 'green'
    })
  },
  genericServerIssueWithResponse (code, message) {
    Notify.create({
      message: `[${code}] ${message}, please try again soon`,
      position: 'top',
      timeout: 2500,
      color: 'red'
    })
  },
  genericServerIssue (message) {
    Notify.create({
      message: `[${message}] Please try again soon`,
      position: 'top',
      timeout: 2500,
      color: 'red'
    })
  },
  scadServerIssueWithResponse (code, message) {
    Notify.create({
      message: `[${code}] ${message}. Unable to retrieve SCAD details. Please try again soon`,
      position: 'top',
      timeout: 2500,
      color: 'red'
    })
  },
  scadServerIssue (message) {
    Notify.create({
      message: `[${message}] Unable to retrieve SCAD details. Please try again soon`,
      position: 'top',
      timeout: 2500,
      color: 'red'
    })
  }
}
