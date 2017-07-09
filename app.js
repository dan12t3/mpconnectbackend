var express = require('express');
var app = express();

/*app.listen(9000, function(err) {
    if(err){
       console.log(err);
       } else {
       console.log("listen:9000");
    }
});*/

app.get('*', function(req, res) {
  res.status(200).send('ok')
});
