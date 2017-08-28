const express = require('express');
const router = express.Router();

router.use('/',(req,res,next) => {
  //connect to db
  next();
});

router.post('/newuser',(req,res) => {
  //inputs new user to db
  res.end();
});

router.get('/validateuser',(req,res) => {
  //checks if username and email are valid
  res.end();
});


module.exports = router;
