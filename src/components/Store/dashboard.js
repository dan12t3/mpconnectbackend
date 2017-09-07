const express = require('express');
const router = express.Router();
const console = require('console');
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

  router.post('/updateProfile',(req,res) => {

    const {firstname,lastname,phone} = req.body;

    let query = "UPDATE ?? SET ??=?, ??=?, ??=? WHERE ??=?";
    const insert = ['users','firstname',firstname,'lastname',lastname,'phone',phone,'userID',req.user.id];

    query = mysql.format(query,insert);

    req.conn.query(query,(err)=> {
      if(err) {
        console.log(err);
        return res.end("We're sorry, your profile couldn't be updated");
      }
      else res.end("Your profile has been successfully updated");
    })

  });

  router.post('/changeEmail',(req,res) => {

    const {email} = req.body;

    let query = "UPDATE ?? SET ??=? WHERE ??=?";
    const insert = ['users','email',email,'userID',req.user.id];

    query = mysql.format(query,insert);

    req.conn.query(query,(err)=> {
      if(err) {
        console.log(err);
        return res.end("We're sorry, your email couldn't be updated");
      }
      else res.end("Your email has been successfully updated");
    })

  });

  router.post('/changePassword',(req,res) => {

    const toReturn = {};


    let query = "SELECT ??,?? FROM ?? WHERE ??=?";
    const insert = ['salt','password','users','userID',req.user.id];



    query = mysql.format(query,insert);

    req.conn.query(query,(err,data)=> {
      if(err) {
        toReturn.error = "We're sorry, there's something wrong at our end, please try again later."
        res.json(toReturn);
      }
      else{
        console.log('extracted old password');
        if(helper.compare(helper.SHA512(req.body.currentpassword,data[0].salt),data[0].password)){
          //generate new salt
          console.log('old password verified');
          const salt = helper.generateSalt(helper.saltLength);
          let query2 = "UPDATE ?? SET ??=?, ??=? WHERE ??=?";
          const insert2 = ['users','password',helper.SHA512(req.body.password,salt),'salt',salt,'userID',req.user.id];

          query2 = mysql.format(query2,insert2);

          req.conn.query(query2,err => {
            if(err){
              toReturn.error = "Password couldn't be updated";
              res.json(toReturn);
            }else{
              console.log('password updated');
              res.end("Your password has been updated.");
            }


          })

        }else{
          toReturn.error = "Invalid Password";
          res.json(toReturn);
        }
      }

      //res.end(false);
    })

    //get the salt
    //convert oldpassword to hash using salt
    //verify password

    //if password is verified
      //generate new salt
      //generate newpassword using salt
      //update salt and password




  });

  return router;
}
