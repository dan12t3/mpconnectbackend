const express = require('express');
const router = express.Router();
const console = require('console');
const mysql = require('mysql');
const config = require('../../config/dbConfig.js');
const helper = require('./dbFunctions');


router.use('/',(req,res,next) => {
  //connect to db

  req.conn = mysql.createConnection(config);
  req.conn.connect((err) => {
    if(err) {
      console.log(err);
      res.end(err);
    }
    else {
      console.log('DB Connection Established');
      next();
    }
  });


});



router.post('/newuser',(req,res) => {

  const { username, password, firstname, lastname, email, phone } = req.body;
  //inputs new user to db
  const salt = helper.generateSalt(helper.saltLength);

  let query = "INSERT INTO ?? (??, ??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const insert = ['users','username','password','firstname','lastname','email','phone','salt',username,helper.SHA512(password,salt),firstname,lastname,email,phone,salt];

  query = mysql.format(query,insert);

  req.conn.query(query, err=> {

    if(err){
      console.log(err);
      req.conn.end();
      res.end(err);
    }else{
      console.log("Query successful");
      req.conn.end();
      res.end()
    }
  });

  //console.log(req.body);
  //res.end();
});

router.get('/validateuser',(req,res) => {
  //checks if username and email are valid

  const error = {};
  //const query = "SELECT COUNT(*) AS result FROM ?? WHERE ?? = ?";
  let query = "SELECT ";
  const usernameQuery = `(SELECT COUNT(*) FROM users WHERE username = '${req.query.username}') AS usernameCount`;
  const emailQuery = `(SELECT COUNT(*) FROM users WHERE email = '${req.query.email}') AS emailCount`;

  if(req.query.username !== 'undefined'){

    query = query + usernameQuery;

    if(req.query.email !== 'undefined'){
      query = query + ", ";
    }
  }

  if(req.query.email !== 'undefined'){

    query = query + emailQuery;
  }

  req.conn.query(query, (err,data) => {

    const usernameCount = data[0]['usernameCount'];
    const emailCount = data[0]['emailCount'];

    if(usernameCount !== undefined && usernameCount > 0){
      error.username = "We're sorry, that username is unavailable";
    }
    if(emailCount !== undefined && emailCount > 0){
      error.email = "We're sorry, that email is already in use";
    }

    res.json(error);

  })






});


module.exports = router;
