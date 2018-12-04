const connect = require('connect')
const app = require('connect')()
const logger = require('./logger')
const errorHandler = require('./errorHandler')

function hello(req, res) {
    res.setHeader('Content-type', 'text/plain')
    res.end('Hello, world!')
}

connect().use((req, res, next) => {
    foo()
    res.end('hello world')
}).use(logger(':method :url')).use(hello).use(errorHandler).listen(3000)