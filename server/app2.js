var express = require('express')
var chalk = require('chalk')
var debug = require('debug')('app')
var morgan = require('morgan')
var bodyParser = require('body-parser')
// var path = require('path')
var logger = require('morgan')


var app = express()
const port = process.env.PORT || 3000
var authRoutes = require('./routes/auth-routes')

app.use('/auth', authRoutes)

app.use(logger('dev'))
app.use(morgan('tiny'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
  res.send('Hello')
})

app.listen(port, function () {
  debug(`Listening on port ${chalk.green(port)}`)
})
