import { Notify } from 'quasar'

export default {
  saveSuccessful (message) {
    Notify.create({
      message: `${message}`,
      position: 'top',
      color: 'green',
      icon: 'check'
    })
  },
  salarySaveSuccessful () {
    Notify.create({
      message: ` Salary Saved`,
      position: 'top',
      color: 'green',
      icon: 'check',
      timeout: 1000
    })
  },
  teamSaveSuccessful () {
    Notify.create({
      message: ` Team Saved`,
      position: 'top',
      color: 'green',
      icon: 'check',
      timeout: 1000
    })
  },
  salaryLimit () {
    Notify.create({
      message: 'Salary Adjustment exceeds Team Salary Cap',
      position: 'top',
      icon: 'error',
      color: 'red'
    })
  },
  leagueAlreadyRegistered () {
    Notify.create({
      message: 'This league is already registered',
      position: 'top',
      icon: 'error',
      color: 'red',
      actions: [
        { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
      ]
    })
  },
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
  emailCommissioner (email) {
    Notify.create({
      message: `Email Sent to ${email}.  We look forward to serving your SCAD needs soon!`,
      position: 'top',
      color: 'info',
      timeout: 10000,
      icon: 'email',
      actions: [
        { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
      ]
    })
  },

  // ERROR RESPONSES

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
