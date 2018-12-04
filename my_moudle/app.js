const express = require('express')

const app = express()

app.config.set('db','mysql')

module.exports = app