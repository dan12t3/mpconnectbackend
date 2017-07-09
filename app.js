var express = require('express');
var app = express();

//constants

const api_key = "84f3302b4c6a4c2f3ce6fd4aad2ff99c";
const scopes = "read_reports,read_products,read_orders";
const redirect_uri = "https://mp-connect.herokuapp.com/"; //needs to
const nonce = "123"; //needs to be random and unique

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

  res.redirect(shopifyURL);
});
