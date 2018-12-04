const express = require('express')
const bodyParser = require('body-parser')
const read = require('node-readability')
const app = express()
const Article = require('./db').Article

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(
    '/css/bootstrap.css',
    express.static('node_modules/bootstrap/dist/css/bootstrap.css')
)

app.set('port', process.env.PORT || 3000)

app.get('/articles', (req, res, next) => {
    Article.all((err, articles) => {
        if (err) return next(err)
        res.format({
            html: () => {
                res.render('articles.ejs', {
                    articles: articles
                })
            },
            json: () => {
                res.send(articles)
            }
        })
    })
})

// read('https://www.jianshu.com/p/c4b3c8b435ab', function (err, article, meta) {
//     // Main Article
//     console.log('Contetn\n', article.content);
//     // Title
//     console.log('Title\n', article.title);
//     // Close article to clean up jsdom and prevent leaks
//     article.close();
// })
app.post('/articles', (req, res, next) => {
    const url = req.body.url
    read(url, (err, result) => {
        // if (err || !result) res.status(500).send('Error downloading articles')
        if (err) {
            next(err)
            return
        }
        console.log(result.title);
        Article.insert({
                title: result.title,
                content: result.content
            },
            (err, article) => {
                if (err) next(err)
                res.send('OK')
            })
    })
})

app.get('/articles/:id', (req, res, next) => {
    const id = req.params.id
    Article.find(id, (err, articles) => {
        if (err) next(err)
        res.format({
            html: () => {
                res.send(articles)
            },
            json: () => {
                res.send(articles)
            }
        })
    })
})

app.delete('/articles/:id', (req, res, next) => {
    const id = req.params.id
    Article.delete(id, (err) => {
        if (err) next(err)
        res.send({
            message: 'Delete'
        })
    })
})

app.listen(app.get('port'), () => {
    console.log('App started on port', app.get('port'))
})