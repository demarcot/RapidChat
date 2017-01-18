var express = require('express'),
    http = require('http'),
    app = express(),
    server = http.createServer(app),
    io = require('socket.io'),
    io = io.listen(server),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

var mongodb = require('mongodb');
var runningDB;
var MongoClient = mongodb.MongoClient;
var myUrl = 'mongodb://localhost:27017';
MongoClient.connect(myUrl, function(err, db) {
  
  if(err)
  {
    console.log("Error connecting to MongoDB... you suck!");
  }
  else
  {
    console.log("Connection established to: ", myUrl);
    runningDB = db;
  }
});

server.listen(3000);
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(cookieParser());

//express will use this as a static route for the web page serving
app.use(express.static(__dirname +  '/frontend/app/'));

//this is our test routes for the API Will come in to play later on
require('./routes/api')(app);


// this is our require for the socket.io js file
require('./sockets/sockCore')(io);

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
