var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongojs');
var db = mongo(config.connectionURL, ['chatrooms']);

var service = {};

service.getAll = getAll;
service.create = create;
service.delete = _delete;
service.getMessages = getMessages;
service.insertMessage = insertMessage;
service.inviteUser = inviteUser;

module.exports = service;

/*
	Get chatroom by id
	- id
	- need anything else?
*/
function getAll() {
    var deferred = Q.defer();

    db.chatrooms.find({}, function (err, chatrooms) 
	{
        if (err) deferred.reject(err);

        if (chatrooms) {
            deferred.resolve(chatrooms);
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
		- accepted users <- contains user id who created it upon init
		- pending users <- empty upon init
		- messages [] <- empty upon init
		- private <- false upon init
		- max users <- set by user during creation
*/
function create(chatroomParam) {
    var deferred = Q.defer();

    db.chatrooms.insert(
		{
			'name': chatroomParam.name,
			'acceptedUsers': [chatroomParam.userId],
			'pendingUsers': [],
			'messages': [],
			'private': chatroomParam.privateStatus,
			'maxUsers': chatroomParam.maxUsers
		},
        function (err, doc) {
            if (err) deferred.reject(err);

            deferred.resolve();
        });
    
    return deferred.promise;
}

/*
	TODO(Tom): This needs to be tested. How do we get the id of the chatroom?
	Insert message into chatroom
	- message content
	- author <- Should this be the username in case the user account gets deleted?
	- timestamp
	- ?
*/
function insertMessage(chatroomParam) {
    var deferred = Q.defer();
    
    db.chatrooms.update(
        {_id: mongo.ObjectId(chatroomParam._id)},
        {$push: {'messages': {'author': chatroomParam.userName, 'messageContent': chatroomParam.messageContent, 'timestamp': chatroomParam.timestamp}}},
        function(err, doc)
        {
            if(err) deferred.reject(err);
            deferred.resolve();
        });
  
    return deferred.promise;
}

/*
	TODO(Tom): Need to figure this out. Probably once it's connected to the front end, and I can see what's wrong.
	Get messages
	- number of messages to get
	- ?
*/
function getMessages(chatroomParam)
{
    var deferred = Q.defer();

	//The query currently gets the correct chatroom
    var docsToReturn = db.chatrooms.find
    (	
        {$query: {_id: mongo.ObjectId(chatroomParam._id)}},
        {}
    ).limit(chatroomParam.messageNum);
    deferred.resolve(docsToReturn);
    //db.yourcollectionname.find({$query: {}, $orderby: {$natural : -1}}).limit(yournumber)  <-- something like this to get last N elements?
    
}

/*
	Invite User(s)
	- chatroom id
	- username
*/
function inviteUser(chatroomParam)
{
	var deferred = Q.defer();
	
	//Instead of inserting username, find userId and insert that?
	db.chatrooms.update
	(
		{_id: mongo.ObjectId(chatroomParam._id)},
		{$push: {'pendingUsers': chatroomParam.username}},
		function (err, doc)
		{
			if(err) deferred.reject(err);
			deferred.resolve();
		}
	);
	
	return deferred.promise;
}

function _delete(chatroomParam) {
    var deferred = Q.defer();

    db.chatrooms.remove(
        { _id: mongo.ObjectId(chatroomParam._id) },
        function (err) {
            if (err) deferred.reject(err);

            deferred.resolve();
        });

    return deferred.promise;
}