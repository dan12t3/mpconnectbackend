const express = require('express');
const router = express.Router();
const console = require('console');



module.exports = (passport) => {
  router.use('/',passport.authenticate('jwt',{ session: false }),(req,res,next) => {
    next();
  });

  router.get('/',(req,res)=> {
    console.log(req.user);
    res.end();
  })

  return router;
}
