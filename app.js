var express = require('express');
var app = express();
var crypto = require('crypto');
var querystring = require('querystring');
var Promise = require('promise');
var request = require("request");

//constants
const secret = "e1b7b1cf4f381e406226b2a68821492b";
const api_key = "84f3302b4c6a4c2f3ce6fd4aad2ff99c";
//const scopes = "read_content,write_content,read_reports,write_reports,read_products,write_products,read_orders,write_orders";
const scopes = 'read_content';
const hostname = "http://localhost:5000";
const options = '';
const redirect_uri = hostname + "/verify/store"; //needs to
//const nonce = "123"; //needs to be random and unique
var shop = 'dan12t3devstore';
const nonce = crypto.randomBytes(16).toString('hex'); //needs to be random and unique

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
  var shopifyURL = 'https://'+shop+'.myshopify.com/admin/oauth/authorize?client_id='+api_key+'&scope='+scopes+'&redirect_uri='+redirect_uri+'&state='+nonce+'&grant_options[]='+options;
  console.log(shopifyURL);
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

    postForToken(verifyCount,res,authCode);
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
    postForToken(verifyCount,res,authCode);
  }else{
    rejectToken(res);
  }


});

function isReachable(hostname){
  //hostname = 'www.google.ca'
  console.log('host:',hostname);
  var options = { method: 'GET',
  url: 'http://'+hostname,
  headers:
   { 'User-Agent': 'javascript',
     'cache-control': 'no-cache' } };


  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
  if (error){
    reject(error);
    throw new Error(error);
  }else{
    resolve(response.statusCode);
  }

  //console.log(body);
});
  });
}

function postForToken(count,res,code){

  if(count === 4){
    console.log("Ready to Post");

    var options = { method: 'POST',
      url: 'https://dan12t3devstore.myshopify.com/admin/oauth/access_token',
      headers:
       { 'User-Agent': 'javascript',
         'cache-control': 'no-cache',
         'content-type': 'application/json'
          },
      formData:
       { client_id: '84f3302b4c6a4c2f3ce6fd4aad2ff99c',
         client_secret: 'e1b7b1cf4f381e406226b2a68821492b',
         code: code } };

    request(options, function (error, response, body) {
      console.log(response.statusCode);
      if (error) throw new Error(error);
      res.end(body);
      console.log(body);
    });



    /*var data = querystring.stringify({
      'client_id': api_key,
      'client_secret' : secret,
      'code' : code
    });

    var option = {
      host: shop+'.myshopify.com',
      path: '/admin/oauth/access_token',
      method: 'POST'/*,
      headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
        }
    }

    var post = postRequest(option,res);
    post.write(data);
    post.end();
  //res.send("ok");*/
  }
}

function postRequest(option,frontResponse){
  return http.request(option,(res) => {
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      frontResponse.send(chunk);


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


function isShopify(hostname){
  const hostArray = hostname.split(".");

  if(hostArray[hostArray.length-2] === "myshopify" && hostArray[hostArray.length-1] === "com"){
    var shopArray = hostArray.splice(0,hostArray.length-2);
    var shopName = shopArray.join(".");
    //console.log(shop);
    //console.log(shopName);

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
