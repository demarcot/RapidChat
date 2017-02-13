var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
//var mongo = require('mongoskin');
//var db = mongo.db(config.connectionString, { native_parser: true });
//db.bind('users');
var mongo = require('mongojs');
var db = mongo(config.connectionURL, ['chatrooms']);

var service = {};

service.getById = getById;
service.create = create;
service.delete = _delete;
service.getMessages = getMessages;
service.insertMessage = insertMessage;

module.exports = service;

function getById(_id) {
    var deferred = Q.defer();

    db.chatrooms.findOne({_id: mongo.ObjectId(_id)}, function (err, chatroom) {
        if (err) deferred.reject(err);

        if (chatroom) {
            deferred.resolve(chatroom);
        } else {
            // chatroom not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(chatroomParam) {
    var deferred = Q.defer();

    // validation
    db.chatrooms.findOne(
        { chatroomName: chatroomParam.name },
        function (err, chatroom) {
            if (err) deferred.reject(err);

            if (chatroom) {
                // username already exists
                deferred.reject('Chatroom "' + chatroomParam.name + '" is already taken');
            } else {
                createChatroom();
            }
        });

    function createChatroom() {
        // set user object to userParam without the cleartext password
        var chatroom = chatroomParam;
       
        db.chatrooms.insert(
            chatroom,
            function (err, doc) {
                if (err) deferred.reject(err);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function insertMessage(_id, chatroomParam) {
    var deferred = Q.defer();
    
    /*
    // validation
    db.chatrooms.findOne({_id: mongo.ObjectId(_id)}, function (err, chatroom) {
        if (err) deferred.reject(err);

        if (chatroom.name !== chatroomParam.name) {
            // chatroom name has changed so check if the new chatroom name is already taken
            db.chatrooms.findOne(
                { name: chatroomParam.name },
                function (err, chatroom) {
                    if(err) deferred.reject(err);

                    if (chatroom) {
                        // chatroom name already exists
                        deferred.reject('Chatroom "' + req.body.chatroomName + '" is already taken')
                    } else {
                        updateChatroom();
                    }
                });
        } else {
            updateChatroom();
        }
    });
    */

    /*
    function updateChatroom() {
    }
    */
    
    db.chatrooms.update
    (
        {_id: mongo.ObjectId(_id), auth: chatroomParam.usernameInserting, msg: chatroomParam.messageContent},
        {$push: {messages: {author: auth, messageContent: msg}}},
        function(err, doc)
        {
            if(err) deferred.reject(err);
            deferred.resolve();
        }
    );
    

    return deferred.promise;
}

function getMessages(_id, chatroomParam)
{
    var deferred = Q.defer();

    //chatroomParam, in this case should have the number of messages to get?
    //this command doesn't look right
    //might need a function inside this call that returns
    var docsToReturn = db.chatrooms.find
    (	
        {$query: {name: chatroomParam.name}, $orderby: {$natural: -1} },
        {}
    )
    deferred.resolve(docsToReturn);
    //db.yourcollectionname.find({$query: {}, $orderby: {$natural : -1}}).limit(yournumber)  <-- something like this to get last N elements?
    
}

function _delete(_id) {
    var deferred = Q.defer();

    db.chatrooms.remove(
        { _id: mongo.ObjectId(_id) },
        function (err) {
            if (err) deferred.reject(err);

            deferred.resolve();
        });

    return deferred.promise;
}