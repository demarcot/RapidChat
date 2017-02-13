var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongojs');
var db = mongo(config.connectionURL, ['chatrooms']);

var service = {};

service.getById = getById;
service.create = create;
service.delete = _delete;
service.getMessages = getMessages;
service.insertMessage = insertMessage;

module.exports = service;

/*
	Get chatroom by id
	- id
	- need anything else?
*/
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

/*
	Create chatroom
	- chatroomParam contains:
		- name
		- users?
		- ?
*/
function create(chatroomParam) {
    var deferred = Q.defer();

    db.chatrooms.insert(
        chatroomParam,
        function (err, doc) {
            if (err) deferred.reject(err);

            deferred.resolve();
        });
    
    return deferred.promise;
}

/*
	Insert message into chatroom
	- message by message or bulk insertions?
	- message content
	- author
	- timestamp
	- ?
*/
function insertMessage(_id, chatroomParam) {
    var deferred = Q.defer();
    
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

/*
	TODO(Tom): Need to figure this out. Probably once it's connected to the front end, and I can see what's wrong.
	Get messages
	- number of messages to get
	- ?
*/
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

/*
	Delete chatroom
	- do we want this ability?
*/
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