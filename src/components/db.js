const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../dbConfig.js')
const console = require('console');



router.use('/',(req,res,next) => {
  //db connect
  req.conn = mysql.createConnection(config);
  req.conn.connect((err) => {
    if(err) console.log(err);
    else console.log('connected');
  });

  next();
});

router.post('/saveToken',(req,res) => {
  // sanitize and prepared statements
  let query = "INSERT INTO ?? (??, ??, ??) VALUES (? , ?, ?)";
  let  inserts = ['stores','store_name','access_token','scope',req.body.store_name,req.body.access_token,req.body.scope];
  query = mysql.format(query,inserts);

  req.conn.query(query, (err) => {
    if(err) console.log(err);
    else console.log('success');
  })

  //end connection
  req.conn.end();
  res.end('save token');



});

module.exports = router;
