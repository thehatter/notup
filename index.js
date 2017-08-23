const express = require('express');
const request = require('request');
const cheerio = require('cheerio');

const app = express();


app.get('/hello/', function (req, res) {
  res.send('Hello World!');
});

// old module part
//function urlExists(url, cb) {
  //request({ url: url, method: 'HEAD' }, function(err, res) {
    //if (err) return cb(null, false);
    //cb(null, /4\d\d/.test(res.statusCode) === false);
  //});
//}

function checkUrlexistence(url) {
  return new Promise(function (resolve, reject) {
    request({ url: url, method: 'HEAD' }, function(err, res) {
      if (err) resolve(false, err);
      else resolve(/4\d\d/.test(res.statusCode) === false);
    });
  });
}

function checkTitle(url, title) {
  return new Promise(function (resolve, reject) {
    request(url, function (err, response, body) {
      if (err) resolve(false, err);
      else {
        let $ = cheerio.load(body); //parse page with cheerio
        let siteTitle = $(document).attr('title');
        resolve(siteTitle);
      }
    });
  });
}

app.get('/test/', function(req, res) {
  // req template: localhost:3000/test/?url=http://google.com
  checkUrlexistence(req.query.url)
    .then(
      result => res.json({'hello': result, '': req.query.url}),
      error => console.log('Rejected: ' + error),
    );
});

app.get('/test_title/', function(req, res) {
  // req template: localhost:3000/test_title/?url=http://google.com&title="test title!"
  checkUrlexistence(req.query.url, req.query.title)
    .then(
      result => res.json({'Title is': result, ' for: ': req.query.url}),
      error => console.log('Rejected: ' + error),
    );
});

app.listen(3000, function () {
  console.log('Аpp is listening on port 3000!');
});
