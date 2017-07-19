const express = require('express');
const console = require('console');
const auth = require('./components/auth.js');
const config = require('./config.js');
const session = require('express-session');

const port = process.env.PORT || config.port;
//const server = config.host;

let app = new express();

app.listen(port,(err) => {
  if(err) console.log(err);
  else console.log("Server running on: " + port);
})

let sess = {
  secret: 'kakazoo',
  cookie: {},
  resave: true,
  saveUninitialized: false
}

if(app.get('env') === 'production') {
  app.set('trust proxy',1);
  sess.cookie.secure = true;
}

app.use(session(sess));
app.use('/auth',auth);
