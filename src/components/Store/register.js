const express = require('express');
const router = express.Router();
const console = require('console');
const mysql = require('mysql');
const config = require('../../dbConfig.js');

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

  let query = "INSERT INTO ?? (??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?)";
  const insert = ['users','username','password','firstname','lastname','email','phone',username,password,firstname,lastname,email,phone];

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
  res.end();
});


module.exports = router;
