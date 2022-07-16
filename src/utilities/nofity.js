import { Notify } from 'quasar'

export default {
  offseason () {
    Notify.create({
      // position: 'top',
      type: 'warning',
      multiLine: true,
      message: '[OFFSEASON MODE] - Below are screenshots of all teams final rosters, draft picks and cap exceptions following the 2021 season. I am working on some updates and will have it back running sooner than later.  Any draft picks and / or cap exemptions made in the meantime will be entered once the site is live again.',
      timeout: 30000,
      actions: [
        { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
      ]
    })
  },
  saveSuccessful (message) {
    Notify.create({
      message: `${message}`,
      position: 'top',
      color: 'green',
      icon: 'check'
    })
  },
  success (message) {
    Notify.create({
      message: `${message}`,
      position: 'top',
      color: 'green',
      icon: 'check'
    })
  },
  warning (message) {
    Notify.create({
      message: `${message}`,
      position: 'top',
      color: 'warning',
      icon: 'warning'
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
  error (message) {
    Notify.create({
      message: `${message}`,
      position: 'top',
      icon: 'error',
      color: 'red',
      timeout: 10000,
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

  dashboardRegister () {
    Notify.create({
      message: `Try refreshing, or logging in again.`,
      position: 'top',
      timeout: 2500,
      color: 'red',
      actions: [
        { label: 'Refresh', color: 'white', handler: () => { window.location.reload() } }
      ]
    })
  },
  genericServerIssueWithResponse (code, message) {
    Notify.create({
      message: `${message}, please try again soon`,
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
      message: `Error Retrieving Info. Please try again soon`,
      position: 'top',
      timeout: 2500,
      color: 'red'
    })
  },
  nodeServerIssueWithResponse (message) {
    Notify.create({
      message: `${message}. Please try again soon`,
      position: 'top',
      timeout: 2500,
      color: 'red',
      actions: [
        { label: 'Refresh', color: 'white', handler: () => { window.location.reload() } }
      ]
    })
  },
  nodeServerIssueDraftPick (message) {
    Notify.create({
      message: `${message}. Hit refresh button on page`,
      position: 'top',
      timeout: 2500,
      color: 'red'
    })
  },
  nodeServerIssue () {
    Notify.create({
      message: `Error Retrieving Scad Details. Please try again soon`,
      position: 'top',
      timeout: 2500,
      color: 'red',
      actions: [
        { label: 'Refresh', color: 'white', handler: () => { window.location.reload() } }
      ]
    })
  }
}
