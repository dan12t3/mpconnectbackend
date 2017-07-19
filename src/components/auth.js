const express = require('express');
const config = require('../config.js');
const console = require('console');
const router = express.Router();
const crypto = require('crypto');
const shopifyAPI = require('shopify-node-api');

let shopifyConfig = {
  shop: '', // MYSHOP.myshopify.com
  shopify_api_key: config.apiKey, // Your API key
  shopify_shared_secret: config.secret, // Your Shared Secret
  shopify_scope: config.scope,
  redirect_uri: config.redirect,
  nonce: crypto.randomBytes(16).toString('hex') // you must provide a randomly selected value unique for each authorization request
}


router.get('/access',(request, response) => {

  shopifyConfig.shop = request.query.shop;
  let shopify = new shopifyAPI(shopifyConfig);

  let auth_URL = shopify.buildAuthURL();
  response.redirect(auth_URL);
});

router.get('/exchange',(request, response) => {


});

module.exports = router;
