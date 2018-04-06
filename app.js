var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var lotameIds = require('./lotameIds.json');

var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var userCount = [];
app.get('/log', function(req, res, next) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('Log des appels au script \n');
  for (i = 0; i < 15; i++) { 
    var d = new Date();
    d.setDate(d.getDate() - i);
      var year   = d.getFullYear();
      var month  = d.getMonth() + 1;
      var day    = d.getDate();
      if(typeof userCount[day+"/"+month+"/"+year] !== "undefined") {
        res.write(day+"/"+month+"/"+year+' => '+ userCount[day+"/"+month+"/"+year] + ' appels du script\n');
      }
    }
  res.end();
});

app.get('/retag/:tagIds', function(req, res) {
  var now = new Date();
  var year   = now.getFullYear();
  var month    = now.getMonth() + 1;
  var day    = now.getDate();
  if(typeof userCount[day+"/"+month+"/"+year]  === "undefined") {
    userCount[day+"/"+month+"/"+year] = 0;
  }
  userCount[day+"/"+month+"/"+year] ++;
  var taglist = req.params.tagIds.split(',');
  var stringTags = '';
  taglist.forEach(function(tagEl){
    lotameIds.forEach(function(lotamEl){
      if(lotamEl.TargetingCode!=='') {
        if( lotamEl.ID==tagEl) {
          stringTags = stringTags+lotamEl.TargetingCode+',';
        }
      }
    });
  });
  let newUrl = 'https://be-rtl.videoplaza.tv/proxy/pixel/v2?LotameParam='+stringTags;
  res.redirect(newUrl);
});

app.get('/', function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<body><h1>IP Belgium / Data converter</h1></body>');
  res.end();
});

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in s
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;