const express = require('express');
const router = express.Router();

router.use('/',(req,res,next) => {

  next();
});

router.post('/newuser',(req,res) => {
  res.end();
});

router.get('/validateuser',(req,res) => {
  
  res.end();
});


module.exports = router;
