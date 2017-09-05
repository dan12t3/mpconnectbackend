const express = require('express');
const router = express.Router();
const console = require('console');
const dbConfig = require('../../config/dbConfig.js');
const mysql = require('mysql');
const helper = require('./dbFunctions.js');
const jwt = require('jsonwebtoken');
const config = require('../../config/config.js');

router.use('/',(req,res,next) => {
  req.conn = mysql.createConnection(dbConfig);
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

})

router.post('/',(req,res) => {
  console.log(req.body);
  //use passport to confirm login
  //return username and userinfo
  //generate and return JWT token
  const user = {};
  const data = {};

  let query = "SELECT * FROM ?? WHERE ??=? ";
  const insert = ['users','username',req.body.username];
  query = mysql.format(query,insert);
  req.conn.query(query, (err,d) => {
    if(err){ //if ereror end response
      res.status(500).end();
    }

    if(d.length < 1){ //if username not found
      data.error = true;
    }else{ //if user found

      if(helper.compare(helper.SHA512(req.body.password,d[0].salt),d[0].password)){ //if pass matches
        //user.username = d[0].username;
        user.id = d[0].userID;

        const token = jwt.sign(user, config.JWTsecret, {
          expiresIn: 15
        });

        data.success = true
        data.token = token;


      }else{ //if pass doesnt match
        data.error = true;
      }



    }
    console.log("err",err);
    console.log("data",data);
    res.json(data);
  })




});



module.exports = router;
