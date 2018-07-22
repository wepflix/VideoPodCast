var express = require('express');
var path = require('path');
var flash = require('connect-flash');
var app = express();
app.set('port', (process.env.PORT || 3000));
app.set('view engine', 'ejs');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(flash());
app.use(express.static(__dirname+'/views'));
app.set('views', __dirname + '/views');

app.get('/', function(request, response) {

  response.sendFile(__dirname + '/views/index.html');
});
app.get('/getFeed', function(request, response) {
    let Parser = require('rss-parser');
    let parser = new Parser();
     
    (async () => {
     
      let feed = await parser.parseURL('http://rss.cnn.com/services/podcasting/studentnews/rss.xml');
      //console.log(feed.title);
      response.send(JSON.stringify(feed));
     
    })();
});
app.all('/*', function(req, res, next) 
{
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});
app.use(function(req, res, next) {
  var err = new Error('Page Not Found');
  err.status = 404;
  res.redirect('/');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});