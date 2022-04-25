const express = require('express')
const cors = require('cors')

var app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({ origin: true }))

module.exports = app
