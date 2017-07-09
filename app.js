var express = require('express');
var app = express();

// limit to only accept request from particular IPs

app.listen(process.env.PORT || 5000, function(err) {
    if(err){
       console.log(err);
       } else {
       console.log("listen:5000");
    }
});

app.get('/access/store', function(req, res) {
  res.status(200).send('ok')
});
