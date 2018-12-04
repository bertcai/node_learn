const db = require('db')
const app = require('../app')
db.connect(app.configure('db'))