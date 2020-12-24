'use strict'

// imports
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const cors = require('cors')

// assign express instance to app
const app = express()

// use necessary middlewares
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.info(`Crypto-Service is running on port ${port}`)
})

// import routes here
const cryptoRoute = require('./routes/crypto-route')
app.use('/api/crypto', cors(), cryptoRoute)

module.exports = app
