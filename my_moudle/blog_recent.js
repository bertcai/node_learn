const http = require('http')
const fs = require('fs')

// http.createServer((req, res) => {
//     if (req.url === '/') {
//         fs.readFile('./title.json', (err, data) => {
//             if (err) {
//                 console.log(err)
//                 res.end('Server Error')
//             } else {
//                 const titles = JSON.parse(data.toString())
//                 fs.readFile('./template.html', (err, data) => {
//                     if (err) {
//                         console.log(err)
//                         res.end('Server Error')
//                     } else {
//                         const tmpl = data.toString()
//                         const html = tmpl.replace('%', titles.join('</li><li>'))
//                         res.writeHead(200, {
//                             'Content-type': 'text/html'
//                         })
//                         res.end(html)
//                     }
//                 })
//             }
//         })
//     }
// }).listen(8000, '127.0.0.1')

// 通过中间函数减少嵌套

http.createServer((req, res) => {
    getTitles(res)
}).listen(8000, '127.0.0.1')

function getTitles(res) {
    fs.readFile('./title.json', (err, data) => {
        if (err) {
            handleError(err, res)
        } else {
            const titles = JSON.parse(data.toString())
            getTemplata(titles, res)
        }
    })
}

function getTemplata(titles, res) {
    fs.readFile('./template.html', (err, data) => {
        if (err) {
            handleError(err, res)
        } else {
            formatHtml(titles, data.toString(), res)
        }
    })
}

function formatHtml(titles, tmpl, res) {
    const html = tmpl.replace('%', titles.join('</li><li>'))
    res.writeHead(200, {
        'Content-type': 'text/html'
    })
    res.end(html)
}

function handleError(err, res) {
    console.error(err)
    res.end('Server Error')
}