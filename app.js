var express = require('express');
var app = express();
var crypto = require('crypto');
var http = require('http');
var querystring = require('querystring');
var Promise = require('promise');

//constants
const secret = "e1b7b1cf4f381e406226b2a68821492b";
const api_key = "84f3302b4c6a4c2f3ce6fd4aad2ff99c";
const scopes = "read_reports,read_products,read_orders";
const hostname = "https://mpconnectbackend.herokuapp.com";
const redirect_uri = hostname + "/verify/store"; //needs to
//const nonce = "123"; //needs to be random and unique
var shop = 'dan12t3devstore';
const nonce = crypto.randomBytes(256).toString('hex'); //needs to be random and unique

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
  shop = req.query.name;
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

  if(verifyHost(storeHost)){
    console.log("Hostname confirmed");
    verifyCount++;
  }else{
    rejectToken(res);
  }

  isReachable(storeHost).then((response) => {
    console.log("Hostname is reachable",response);
    verifyCount++;

    postForToken(verifyCount,res);
  },(err) => {
    console.log("Hostname isn't reachable",err);
    rejectToken(res);
  });

  if(state === nonce){
    verifyCount++;
    console.log("Nonce confirmed");
  }else{
    rejectToken(res);
  }

  if(verifyHMAC(req.query,hmac)){
    verifyCount++;
    console.log("HMAC confirmed");
    postForToken(verifyCount,res);
  }else{
    rejectToken(res);
  }
});

function postForToken(count,res,code){
  //POST https://{shop}.myshopify.com/admin/oauth/access_token

  //api_key
  //secret
  //code




  if(count === 4){

    var data = querystring.stringify({
      'client_id': api_key,
      'client_secret' : secret,
      'code' : code
    });

    var option = {
      host: shop+'.myshopify.com',
      port: 80,
      path: '/admin/oauth/access_token',
      method: 'POST',
      headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
        }
    }

    var post = postRequest(option);
    post.write(data);
    post.end();

    console.log("Ready to Post");
    res.send("ok");
  }
}

function postRequest(option){
  return http.request(option,(res) => {
    res.setEncoding('utf8');
    res.on('data', (chunk) => {



      console.log('Response: ' + chunk);
    });
  }).on('error',(e) => {
    console.log(e);
  });

}

function rejectToken(res){
  console.log("Verification Failed");
  res.send("error");
}

//function
function verifyHMAC(obj,hmac){

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

  if(hostArray[hostArray.length-2] === "myshopify" && hostArray[hostArray.length-1] === "com"){
    var shopArray = hostArray.splice(0,hostArray.length-2);
    var shopName = shopArray.join(".");
    console.log(shop);
    console.log(shopName);

    if(shopName.trim().toLowerCase() === shop.trim().toLowerCase()){
      return true;
    }else{
      console.log("shopname isnt the same as before");
      return false;
    }
  }else{

    console.log("not shopify");
    return false;
  }
}

function regexCompare(hostname){
  if(/^[a-z0-9\-.]+$/.test(hostname)){
    return true;
  }else{
    console.log("failed regex");
    return false;
  }
}
