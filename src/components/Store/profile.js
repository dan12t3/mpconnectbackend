const express = require('express');
const console = require('console');
const router = express.Router();
const config = require('../../config.js');
const crypto = require('crypto');
var httpRequest = require('request');



router.use('/',(req,res,next) => {

  //req.session.config.access_token = '';
  //console.log(req.cookies);

  if(crypto.timingSafeEqual(Buffer.from(req.cookies.token),Buffer.from(req.session.config.access_token))){
    next();
  }else{
    console.log('need to redirect to error page');

  }

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

//use webhooks maybe
  //store info in db
  //res.end();

  //respond w/ json object

});

  router.get('/getProducts',(req, res) => {

    var options = {
      url: 'https://'+req.session.config.shop+'/admin/products.json?fields=title',
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



  });


module.exports = router;
