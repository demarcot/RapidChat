var express = require('express'),
    http = require('http'),
    app = express(),
    server = http.createServer(app),
    io = require('socket.io'),
    io = io.listen(server),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    config = require('config.json');

server.listen(3000);
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(cookieParser());

//express will use this as a static route for the web page serving
app.use(express.static(__dirname +  '/frontend/app/'));

//this is our test routes for the API Will come in to play later on
//require('./routes/api')(app);

// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

// routes
app.use('/login', require('./routes/controllers/login'));
app.use('/register', require('./routes/controllers/register'));
app.use('/app', require('./routes/controllers/appController'));
app.use('/api/users', require('./routes/controllers/api/userAPI'));


// this is our require for the socket.io js file
require('./sockets/sockCore')(io);

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
