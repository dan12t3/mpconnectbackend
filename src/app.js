const express = require('express');
const console = require('console');
const auth = require('./components/auth.js');
const config = require('./config.js');

const port = process.env.PORT || config.port;
const server = config.host;

let app = new express();

app.listen(port,(err) => {
  if(err) console.log(err);
  else console.log("Server running on: " + port);
})

app.use('/auth',auth);
