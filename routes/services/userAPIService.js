var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
//var mongo = require('mongoskin');
//var db = mongo.db(config.connectionString, { native_parser: true });
//db.bind('users');
var mongo = require('mongojs');
var db = mongo(config.connectionURL, ['users']);

var service = {};

service.authenticate = authenticate;
service.getById = getById;
service.getAll = getAll;
service.getIsAdmin = getIsAdmin;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function authenticate(username, password) {
    var deferred = Q.defer();

    db.users.findOne({ username: username }, function (err, user) {
        if (err) deferred.reject(err);

        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve(jwt.sign({ sub: user._id }, config.secret));
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}

//TODO(Tom): Return only (id? and ) username
function getById(_id) {
    var deferred = Q.defer();

    db.users.findOne({_id: mongo.ObjectId(_id)}, function (err, user) {
        if (err) deferred.reject(err);

        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

//TODO(Tom): Return only ids and usernames
function getAll() {
    var deferred = Q.defer();

    db.users.find({}, function (err, users)
	{
        if (err) deferred.reject(err);

        if (users) {
            deferred.resolve(users);
        } else {
            // chatroom not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getIsAdmin(_id) {
    var deferred = Q.defer();

    db.users.findOne({_id: mongo.ObjectId(_id)}, {isAdmin:1}, function (err, user) 
	{
        if (err) deferred.reject(err);

        if (user) {
            // return user (without hashed password)

            deferred.resolve(user);
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findOne(
        { username: userParam.username },
        function (err, user) {
            if (err) deferred.reject(err);

            if (user) {
                // username already exists
                deferred.reject('Username "' + userParam.username + '" is already taken');
            } else {
                createUser();
            }
        });

    function createUser() {
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');
        user.colors={'topBarColor':"#666a86",'topBarHover':"#565a76",'sideBarColor':"#95b8d1",'sideBarHover':"#85a8c1"};
        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);
        db.users.find({}, {}, function(err, docs)
        {
            if(docs.length > 0)
            {
                user.isAdmin = false;
                db.users.insert(
                user,
                function (err, doc) {
                    if (err) deferred.reject(err);

                    deferred.resolve();
                });
            }
            else
            {
                user.isAdmin = true;
                db.users.insert(
                user,
                function (err, doc) {
                    if (err) deferred.reject(err);

                    deferred.resolve();
                });
            }
        });
    }

    return deferred.promise;
}

function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findOne({_id: mongo.ObjectId(_id)}, function (err, user) {
        if (err) deferred.reject(err);

        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            db.users.findOne(
                { username: userParam.username },
                function (err, user) {
                    if (err) deferred.reject(err);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            username: userParam.username,
            colors: userParam.colors,
        };

        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        db.users.update(
            { _id: mongo.ObjectId(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.users.remove(
        { _id: mongo.ObjectId(_id) },
        function (err) {
            if (err) deferred.reject(err);

            deferred.resolve();
        });

    return deferred.promise;
}
