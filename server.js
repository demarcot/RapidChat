var express = require('express'),
    http = require('http'),
    app = express(),
    server = http.createServer(app),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

//var mongodb = require('mongodb');


server.listen(3000);
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(cookieParser());

app.use(express.static(__dirname +  '/frontend/app/'));

require('./routes/api')(app);


app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
