require('rootpath')();
var express = require('express'),
    http = require('http'),
    app = express(),
    server = http.createServer(app),
    io = require('socket.io'),
    io = io.listen(server),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    config = require('config.json'),
    expressJwt = require('express-jwt'),
    session = require('express-session');

// this is our require for the socket.io js file
require('./sockets/sockCore')(io);

//view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/ejsViews');
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));


//server.listen(3000);
server.listen(3000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(cookieParser());

//express will use this as a static route for the web page serving
app.get('/', function (req, res) {
    return res.redirect('/frontend/app');
});

//this is our test routes for the API Will come in to play later on
//require('./routes/api')(app);

// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

// routes
app.use('/login', require('./routes/controllers/login'));
app.use('/register', require('./routes/controllers/register'));
app.use('/frontend/app', require('./routes/controllers/appController'));
app.use('/api/users', require('./routes/controllers/api/userAPI'));
app.use('/test/api', require('./routes/controllers/api/chatroomAPI'));





//This is going to be our socket.io connection and message relay
io.on('connection', function (socket) {

 socket.on('message', function (from, msg) {

      console.log("A Message trigger has occured");
    });

});



app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
