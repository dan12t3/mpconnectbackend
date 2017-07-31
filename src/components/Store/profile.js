const express = require('express');
const console = require('console');
const router = express.Router();
var httpRequest = require('request');


router.use('/',(req,res,next) => {


  //verify token with session
  console.log(req.sessionID);


  next();

});

router.get('/fetch',(req,res)=>{

  //use token to make shopify request
  
  var options = {
    url: 'https://'+req.session.config.shop+'/admin/shop.json',
    method: 'GET',
    headers:{
      'User-Agent':'javascript',
      'X-Shopify-Access-Token': req.session.config.access_token
    }
  }

  httpRequest(options,(e,r,d) => {
    if(e) {
      console.log(e);
    }
    else{
      console.log(d);
      res.end(d);

    }
  });

  //use webhooks maybe
  //store info in db


  //respond w/ json object


});

module.exports = router;
