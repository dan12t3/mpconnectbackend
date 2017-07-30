const express = require('express');
const config = require('../config.js');
const console = require('console');
const router = express.Router();
const crypto = require('crypto');
const shopifyAPI = require('shopify-node-api');
var httpRequest = require('request');

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

      const options = {
        method: 'POST',
        url: config.host + '/db/saveToken',
        headers: {
          'content-type' : 'application/x-www-form-urlencoded'
        },
        form: {
          store_name: request.session.config.shop,
          access_token: request.session.config.access_token,
          scope: request.session.config.shopify_scope
        }
      }

      httpRequest(options, (err, res) => {
        if(err) console.log(err);
        else console.log(res.statusCode);
      })

      request.session.destroy((err) => {
        if(err) console.log(err);
      });

      //now what?
      //redirect to embed app page
      console.log(data['access_token']);
      response.redirect(config.front + '/store');

    }
  });



});

module.exports = router;
