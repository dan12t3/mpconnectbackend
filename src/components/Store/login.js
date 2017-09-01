const express = require('express');
const router = express.Router();
const console = require('console');

router.use('/',(req,res,next) => {

  next();
})

router.post('/',(req,res) => {
  console.log(req.body);
  //use passport to confirm login
  //return username and userinfo
  //generate and return JWT token
  const data = {};

  data.name = "dan";
  res.json(data);

});



module.exports = router;
