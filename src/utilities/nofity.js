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
  updateDefaultLeague () {
    Notify.create({
      message: `Default League Updated`,
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
  salaryUpdateOnPlayerRequired (team) {
    Notify.create({
      message: `[${team}] - has players that require salary updates.`,
      position: 'top',
      icon: 'error',
      color: 'orange',
      timeout: 10000
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
  rosterMaxError (pos, count, max) {
    console.log('rosterMaxError()')
    Notify.create({
      message: `Invalid Roster [${pos}]: Current Count: ${count}, League Max: ${max}`,
      position: 'top',
      icon: 'error',
      color: 'red',
      timeout: 10000,
      actions: [
        { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
      ]
    })
  },
  rosterMinError (pos, count, min) {
    Notify.create({
      message: `Invalid Roster [${pos}]: Current Count: ${count}, League Min: ${min}`,
      position: 'top',
      icon: 'error',
      color: 'red',
      timeout: 10000,
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
  exemptionGiverError (name) {
    Notify.create({
      message: `[Cap Exemption Error] - ${name} exceeds exception out limit`,
      position: 'top',
      color: 'red'
    })
  },
  exemptionRecieverError (name) {
    Notify.create({
      message: `[Cap Exemption Error] - ${name} exceeds exception in limit`,
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
  emailCommissioner (message) {
    Notify.create({
      message: `${message}.  We look forward to serving your SCAD needs soon!`,
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
      color: 'red',
      actions: [
        { label: 'Refresh', color: 'white', handler: () => { window.location.reload() } }
      ]
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
      color: 'red',
      actions: [
        { label: 'Refresh', color: 'white', handler: () => { window.location.reload() } }
      ]
    })
  },
  scadServerIssue (message) {
    Notify.create({
      message: `[${message}] Unable to retrieve SCAD details. Please try again soon`,
      position: 'top',
      timeout: 2500,
      color: 'red',
      actions: [
        { label: 'Refresh', color: 'white', handler: () => { window.location.reload() } }
      ]
    })
  },
  scadTimeoutIssue () {
    Notify.create({
      message: `Server Timeout Error.  Trying logging out and logging back in.`,
      position: 'top',
      timeout: 2500,
      color: 'red',
      actions: [
        { label: 'Refresh', color: 'white', handler: () => { window.location.reload() } }
      ]
    })
  },
  nodeServerIssueWithResponse (code, message) {
    Notify.create({
      message: `[${code}] ${message}. Unable to retrieve NODE details. Please try again soon`,
      position: 'top',
      timeout: 2500,
      color: 'red',
      actions: [
        { label: 'Refresh', color: 'white', handler: () => { window.location.reload() } }
      ]
    })
  },
  nodeServerIssue (message) {
    Notify.create({
      message: `[${message}] Unable to retrieve NODE details. Please try again soon`,
      position: 'top',
      timeout: 2500,
      color: 'red',
      actions: [
        { label: 'Refresh', color: 'white', handler: () => { window.location.reload() } }
      ]
    })
  }
}
