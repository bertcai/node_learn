'use strict';
var s = "hello";

function greet(name) {
    console.log(s + ', ' + name + '!');
}

function print(name) {
    console.log(name);
}

function add(a, b) {
    console.log(a + b);
}

const http = require('http')

const port = 8080

const server = http.createServer((req, res) => {
    res.end('Hello World!')
})

server.listen(port, () => {
    console.log(`Server listening on: http://localhost:${port}`)
})

module.exports = {
    greet: greet,
    print: print,
    add: add
}