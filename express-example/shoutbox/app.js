var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const entries = require('./routes/entries')
const register = require('./routes/register')
const validate = require('./middleware/validate')
const session = require('express-session')
const messages = require('./middleware/messages')
const login = require('./routes/login')
const user = require('./middleware/user')
const api = require('./routes/api')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}))
app.use(messages)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', api.auth)
app.use(user)

app.get('/post', entries.form)
app.post('/post', validate.required('entry[title]'), validate.lengthAbove('entry[title]', 4), entries.submit)
app.get('/', entries.list)
app.get('/register', register.form)
app.post('/register', register.submit)
app.get('/login', login.form)
app.post('/login', login.submit)
app.get('/logout', login.logout)
app.get('/api/user/:id', api.user)
app.post('/api/entry', entries.submit)

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function requireEntryTitle(req, res, next) {
  const title = req.body.entry.title
  if (title) {
    next()
  } else {
    res.error('Title is required!')
    res.redirect('back')
  }
}

function requireEntryTitleLegthAbove(len) {
  return (req, res, next) => {
    const title = req.body.entry.title
    if (title.length > len) {
      next()
    } else {
      res.err(`Title must be longer than ${len}`)
      res.redirect('back')
    }
  }
}

module.exports = app;