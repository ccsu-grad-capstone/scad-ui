import { Notify } from 'quasar'

const notify = {
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
  }
}

export { notify }
