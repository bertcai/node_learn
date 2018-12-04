const env = process.env.NODE_ENV || 'development'

function errorHandle(err, req, res, next) {
    res.statusCode = 500
    switch (env) {
        case 'development':
            console.error('Error:\n' + err)
            res.setHeader('Content-type', 'application/json')
            res.end(JSON.stringify(err))
            break
        default:
            res.end('Internal Server Error')
    }
}

module.exports = errorHandle