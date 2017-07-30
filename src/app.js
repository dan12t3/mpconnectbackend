const express = require('express');
const console = require('console');
const session = require('express-session');
const bodyParser = require('body-parser');
//const fs = require('fs');
//const https = require('https');

const auth = require('./components/Store/auth.js');
const db = require('./components/db.js');
const profile = require('./components/Store/profile.js');
const config = require('./config.js');


const port = process.env.PORT || config.port;
//const server = config.host;

let app = new express();

/*const httpsOptions = {
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.crt'),
  passphrase: 'canada'
}
https.createServer(httpsOptions, app).listen(port, (err) => {
  if(err) console.log(err);
  else console.log("Server running on: " + port);
})*/

app.listen(port,(err) => {
  if(err) console.log(err);
  else console.log("Server running on: " + port);
})

let sess = {
  secret: 'kakazoo',
  resave: true,
  saveUninitialized: false
}

if(app.get('env') === 'production') {
  app.set('trust proxy',1);
  sess.cookie.secure = true;
  //use different memorysave for session
}

app.use(session(sess));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth',auth);
app.use('/profile',profile);
app.use('/db',db);
