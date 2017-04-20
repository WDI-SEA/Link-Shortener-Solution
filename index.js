var express = require('express');
var db = require('./models');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var Hashids = require("hashids");
var hashids = new Hashids("LoremIpsum");

app.use(require('morgan')('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

// ------------------ Routes ------------------ //

// app.get('/', function(req, res) {
//   // contains our simple form
//   res.render
// });

app.post('/links', function(req, res) {
  db.link.findOrCreate({
    where: {
      url: req.body.url
    }
  }).spread(function(link, created) {
    var shortPath = hashids.encode(link.id);
    res.redirect('/links/' + shortPath);
  });

});

app.get('/links/:id', function(req, res) {
  var linkId = hashids.decode(req.params.id)[0];
  db.link.findById(linkId).then(function(link) {
    res.send(link.url);
  })

});

app.get('/:hash', function(req, res) {
  var linkId = hashids.decode(req.params.hash)[0];
  db.link.findById(linkId).then(function(link) {
      res.redirect(link.url);
  })

});

// ------------------ Serve ------------------ //

var server = app.listen(process.env.PORT || 3000);
module.exports = server;
