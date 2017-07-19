const express = require('express');
const config = require('../config.js');
const console = require('console');
const router = express.Router();
const crypto = require('crypto');
const shopifyAPI = require('shopify-node-api');

router.use('/',(request,response,next) => {

  if(!request.session.config){
    request.session.config = {
        shop: '', // MYSHOP.myshopify.com
        shopify_api_key: config.apiKey, // Your API key
        shopify_shared_secret: config.secret, // Your Shared Secret
        shopify_scope: config.scope,
        redirect_uri: config.redirect,
        nonce: crypto.randomBytes(16).toString('hex')
    };
  }

  next();
})

router.get('/access',(request, response) => {

  request.session.config.shop = request.query.shop;

  let shopify = new shopifyAPI(request.session.config);
  let auth_URL = shopify.buildAuthURL();

  response.redirect(auth_URL);
});

router.get('/exchange',(request, response) => {

  let shopify = new shopifyAPI(request.session.config);

  shopify.exchange_temporary_token(request.query,(err,data) => {
    if(err){
      console.log(err)
    }else{

      //connect to db

      //db save
        //access token
        //store
        //scope


      request.session.destroy((err) => {
        if(err) console.log(err);
      });

      response.end(data['access_token']);

    }
  });



});

module.exports = router;
