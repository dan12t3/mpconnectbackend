const express = require('express');
const console = require('console');
const router = express.Router();
const config = require('../../config.js');
const crypto = require('crypto');
var httpRequest = require('request');



router.use('/',(req,res,next) => {


  /*req.session.config.access_token = '';
  if(crypto.timingSafeEqual(Buffer.from(req.headers.token),Buffer.from(req.session.config.access_token))){
    next();
  }else{
    console.log('redirecting');
    res.redirect('https://google.com');
  }*/
  //verify token with session
  next();

});


router.get('/fetch',(req,res)=>{
  res.redirect(config.front);
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

      res.end(d);

    }
  });

  router.get('/getProducts',(req, res) => {

  })


  //use webhooks maybe
  //store info in db
  //res.end();

  //respond w/ json object


});

module.exports = router;
