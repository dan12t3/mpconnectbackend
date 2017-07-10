var express = require('express');
var app = express();
var crypto = require('crypto');
var http = require('http');
var Promise = require('promise');

//constants
const secret = "e1b7b1cf4f381e406226b2a68821492b";
const api_key = "84f3302b4c6a4c2f3ce6fd4aad2ff99c";
const scopes = "read_reports,read_products,read_orders";
const hostname = "https://mpconnectbackend.herokuapp.com";
const redirect_uri = hostname + "/verify/store"; //needs to
const nonce = "123"; //needs to be random and unique
//const nonce = cryto.randomBytes(256).toString('hex'); //needs to be random and unique

// limit to only accept request from particular IPs

app.listen(process.env.PORT || 5000, function(err) {
    if(err){
       console.log(err);
       } else {
       console.log("listen:5000");
    }
});

app.get('/access/store', function(req, res) {
  //sanitize name
  var shop = req.query.name;
  var shopifyURL = 'https://'+shop+'.myshopify.com/admin/oauth/authorize?client_id='+api_key+'&scope='+scopes+'&redirect_uri='+redirect_uri+'&state='+nonce+'&grant_options[]=';
  //var shopifyURL = 'https://google.com';
  res.redirect(shopifyURL);
});

app.get('/verify/store',function(req, res){

  var state = req.query.state;
  var hmac = req.query.hmac;
  var storeHost = req.query.shop;
  var authCode = req.query.code;
  var time = req.query.timestamp;
  var verifyCount = 0;

  //promise check for isReachable
    //if successful and other checks are done do the post request
    //post request to - POST https://{shop}.myshopify.com/admin/oauth/access_token
    // body contains client_id, client_id, code

    //else end everything maybe go to error page

  //all the other checks

  //at last check, if promise is done and other checks are done, do post request
  if(verifyHost(storeHost)){
    console.log("Hostname confirmed");
    verifyCount++;
  }else{
    rejectToken();
  }

  isReachable(storeHost).then((res) => {
    console.log("Hostname is reachable",res);
    verifyCount++;

    postForToken(verifyCount);
  },(err) => {
    console.log("Hostname isn't reachable",err);
    rejectToken();
  });

  if(state === nonce){
    verifyCount++;
    console.log("Nonce confirmed");
  }else{
    rejectToken();
  }

  if(verifyHMAC(req.query,hmac,authCode,storeHost,state,time)){
    verifyCount++;
    console.log("HMAC confirmed");
    postForToken(verifyCount);
  }else{
    rejectToken();
  }




});

function postForToken(count){
  if(count === 4){
    console.log("Ready to Post");
  }
}

function rejectToken(){
  console.log("Verification Failed");
}

//function
function verifyHMAC(obj,hmac, authCode, storeHost,state,time){

  delete obj.hmac;

  //replace values
  for(let i in obj) {
   obj[i] = obj[i].replace(/%/g,'%25');
   obj[i] = obj[i].replace(/&/g,'%26');
  }

  var keys = Object.keys(obj);

  //replace keys
  keys.forEach(element => {
    element = element.replace(/%/g,'%25');
    element = element.replace(/&/g,'%26');
    element = element.replace(/=/g,'%3D');
  });

  //construct msg
  var msg='';
  let j=0;
  for(let k in obj) {
    if(j!=0) msg=msg+'&';
    msg = msg + keys[j] + '=' + obj[k];
    j++;
  }

  if(crypto.timingSafeEqual(Buffer.from(hmac),Buffer.from(crypto.createHmac('sha256',secret).update(msg).digest('hex')))){
    return true;
  }
  return false;

}

function verifyHost(hostname){
  let verified = true;

  if(verified && regexCompare(hostname)) verified = true;
  else verified = false;
  if(verified && isShopify(hostname)) verified = true;
  else verified = false;

  return verified;
}

function isReachable(hostname){
  //hostname = 'www.google.ca'
  var options = {
  host: hostname,
  port: 80,
  path: '/index.html'
  };
  return new Promise((resolve, reject) => {
    http.get(options, function(res) {
      resolve(res.statusCode);
    }).on('error', function(e) {
        reject(e);
    });
  });
}

function isShopify(hostname){
  const hostArray = hostname.split(".");
  if(hostArray[hostArray.length-2] === "shopify" || hostArray[hostArray.length-1] === "com"){
    return true;
  }else{
    return false;
  }
}

function regexCompare(hostname){
  if(/^[a-z0-9\-.]+$/.test(hostname)){
    return true;
  }else{
    return false;
  }
}
