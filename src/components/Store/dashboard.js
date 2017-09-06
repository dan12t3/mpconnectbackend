const express = require('express');
const router = express.Router();
//const console = require('console');
const helper = require('./dbFunctions.js');
const mysql = require('mysql');



module.exports = (passport) => {
  router.use('/',passport.authenticate('jwt',{ session: false }),(req,res,next) => {

    //connect to d
    req.conn = helper.dbConnect(res,next);

    //next();
  });

  router.get('/getUser',(req,res)=> {
    //i have the userID to work with, which would be used as the primary key for user data and foreign key for store data

    //run query
    const dataReturn = {}
    let query = "SELECT * FROM ?? WHERE ??=?";
    const insert = ['users','userID',req.user.id];


    query = mysql.format(query,insert);

    req.conn.query(query, (err,data) => {
      dataReturn.username = data[0].username;
      dataReturn.firstname = data[0].firstname;
      dataReturn.lastname = data[0].lastname;
      dataReturn.email = data[0].email;
      dataReturn.phone = data[0].phone;

      res.json(dataReturn);
    })

    //console.log(req.user);

  })

  return router;
}
