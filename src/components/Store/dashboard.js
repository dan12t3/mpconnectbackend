const express = require('express');
const router = express.Router();
const console = require('console');



module.exports = (passport) => {
  router.use('/',passport.authenticate('jwt',{ session: false }),(req,res,next) => {
    next();
  });

  router.get('/getUser',(req,res)=> {
    //i have the userID to work with, which would be used as the primary key for user data and foreign key for store data



    console.log(req.user);
    res.json(req.user);
  })

  return router;
}
