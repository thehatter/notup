var express = require('express')
var app = express()
var request = require('request')


app.get('/hello/', function (req, res) {
  res.send('Hello World!')
})

// old module part
function urlExists(url, cb) {
  request({ url: url, method: 'HEAD' }, function(err, res) {
    if (err) return cb(null, false);
    cb(null, /4\d\d/.test(res.statusCode) === false);
  });
}

function checkUrlexistence(url){
  return new Promise(function (resolve, reject) {
    request({ url: url, method: 'HEAD' }, function(err, res) {
      if (err) resolve(false, err);
      else resolve(/4\d\d/.test(res.statusCode) === false);
    });
  });
}

app.get('/test/', function(req, res) {
  // req template: localhost:3000/test/?url=http://google.com
  checkUrlexistence(req.query.url)
    .then(
      result => res.json({'hello': result, '': req.query.url}),
      error => console.log("Rejected: " + error) 
    );
});

app.listen(3000, function () {
  console.log('Аpp is listening on port 3000!')
})
