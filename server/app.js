const express = require('express')
const chalk = require('chalk')
const debug = require('debug')('app')
const morgan = require('morgan')
const path = require('path')
const bodyParser = require('body-parser')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const authRouter = require('./routes/authRouter')

const app = express()
const port = process.env.PORT || 4000

// app.use(morgan("combined"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({ secret: 'scadfantasy' }))
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404))
// })
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message
//   res.locals.error = req.app.get('env') === 'development' ? err : {}

//   // render the error page
//   res.status(err.status || 500)
//   res.render('error')
// })

// require('./config/passport-setup.js')(app)
// require('./config/passport-yahoo.js')(app)

app.use(express.static(path.join(__dirname, '/public/')))
//views to use if we're displaying anything in the brower from this url (localhost:4000)
app.set('views', './views')
app.set('view engine', 'ejs')

app.use('/auth', authRouter)

app.get('/', (req, res) => {
  res.redirect('http://localhost:8081/')
})

app.listen(port, () => {
  debug(`listening on port ${chalk.green(port)}`)
})
