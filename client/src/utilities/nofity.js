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
  serverIssue (code, message) {
    Notify.create({
      message: `[${code}] ${message}, please try again soon`,
      position: 'top',
      timeout: 2500,
      color: 'red'
    })
  }
}
