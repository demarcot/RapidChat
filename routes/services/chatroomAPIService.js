var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongojs');
var db = mongo(config.connectionURL, ['chatrooms']);

var service = {};

service.getAll = getAll;
service.getAllowedChatrooms = getAllowedChatrooms;
service.getPublicAndPrivate = getPublicAndPrivate;
service.getById = getById;
service.notifyCheck = notifyCheck;
service.create = create;
service.delete = _delete;
service.getMessages = getMessages;
service.getUsers = getUsers;
service.insertMessage = insertMessage;
service.inviteUser = inviteUser;
service.moveToAccepted = moveToAccepted;
service.removeFromAccepted = removeFromAccepted;
service.checkPending = checkPending;

module.exports = service;

/*
	Get chatroom by id
	- id
	- need anything else?
*/
function getAll() {
    var deferred = Q.defer();

    db.chatrooms.find({"private":false}, {"name":1}, function (err, chatrooms)
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

function getById(chatroomParam) {
    var deferred = Q.defer();

    db.chatrooms.find({"_id":mongo.ObjectId(chatroomParam._id)}, {"name":1, "private":1, "direct":1}, function (err, chatrooms)
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
	This function returns all the chatrooms that a specific user is allowed to know about
	chatroomParam
	-	username
*/
function getAllowedChatrooms(chatroomParam)
{
	var deferred = Q.defer()

	db.chatrooms.find({"acceptedUsers": chatroomParam.username}, {"name":1, "direct":1, "acceptedUsers":1}, function (err, chatrooms)
		{
			if(err) deferred.reject(err);

			if(chatrooms)
			{
				deferred.resolve(chatrooms);
			}
			else
			{
				//chatrooms not found
				deferred.resolve();
			}
		});

	return deferred.promise;
}

function getPublicAndPrivate()
{
    var deferred = Q.defer();

    db.chatrooms.find({"direct": false}, {"name": 1}, function (err, chatrooms)
        {
            if(err) deferred.reject(err);

            if(chatrooms)
            {
                deferred.resolve(chatrooms);
            }
            else{
                deferred.resolve();
            }
        });
    return deferred.promise;
}

function notifyCheck(chatroomParam)
{
	var deferred = Q.defer()
	var retBool;
	//If it is a public room, user needs to be notified
  db.chatrooms.find({"_id":mongo.ObjectId(chatroomParam.chatroomId), "private": false}, {"_id":1}, function(err, chatrooms)
		{
			if(err) deferred.reject(err);
			if(chatrooms.length > 0)
			{
				retBool = true;
				deferred.resolve(retBool);
			}
      else { db.chatrooms.find({"_id": mongo.ObjectId(chatroomParam.chatroomId), "acceptedUsers": chatroomParam.username, "private": true}, {"_id":1}, function (err, chatrooms)
    		{
    			if(err) deferred.reject(err);

    			if(chatrooms.length > 0)
    			{
    				retBool = true;
    				deferred.resolve(retBool);
    			}
    			else
    			{
    				//chatrooms not found
    				retBool = false;
    				deferred.resolve(retBool);
    			}
    		});
      }
		});

	//If it is not public, notify the user if they are on the acceptedUsers list



      return deferred.promise;
}

function moveToAccepted(chatroomParam)
{
	var deferred = Q.defer();
	var newPendingUsers;
	db.chatrooms.findOne({"_id": mongo.ObjectId(chatroomParam._id), "pendingUsers": chatroomParam.username}, {"pendingUsers":1, "acceptedUsers":1}, function(err, doc)
		{
			if(err) deferred.reject(err);

			if(doc)
			{
				doc.pendingUsers.splice(doc.pendingUsers.indexOf(chatroomParam.username), 1);
				newPendingUsers = doc.pendingUsers;

				db.chatrooms.update({"_id": mongo.ObjectId(chatroomParam._id)}, {$push: {'acceptedUsers': chatroomParam.username}, $set: {"pendingUsers": newPendingUsers}}, function (err, doc)
					{
						if(err) deferred.reject(err);

						deferred.resolve(true);
					});
			}
			else
			{
				deferred.resolve(false);
			}
		});

	return deferred.promise;
}

function checkPending(chatroomParam)
{
    var deferred = Q.defer();
    var newPendingUsers;
    console.log("username: ", chatroomParam.username)
    db.chatrooms.find({"pendingUsers": chatroomParam.username}, {"name": 1}, function(err, docs)
        {
            if(err) deferred.reject(err);
            if(docs.length > 0)
            {
                deferred.resolve(docs);
            }
            else
            {
                deferred.resolve();
            }
        });

    return deferred.promise;
}

function removeFromAccepted(chatroomParam)
{
    var deferred = Q.defer();
    var newAcceptedUsers;
    db.chatrooms.findOne({"_id": mongo.ObjectId(chatroomParam._id)}, {"acceptedUsers":1}, function(err, doc)
        {
            if(err) deferred.reject(err);

            if(doc)
            {
                console.log("API service", chatroomParam.username);
                doc.acceptedUsers.splice(doc.acceptedUsers.indexOf(chatroomParam.username), 1);
                newAcceptedUsers = doc.acceptedUsers;
                db.chatrooms.update({"_id": mongo.ObjectId(chatroomParam._id)}, {$set: {"acceptedUsers": newAcceptedUsers}}, function(err, docs)
                    {
                        console.log("inside function",chatroomParam.username);
                        if(err) deferred.reject(err);

                        deferred.resolve(true);
                    });
            }
            else
            {
                console.log("Trouble removing user, ", chatroomParam.username + ", from that chatroom...");
                deferred.resolve(false);
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
    var directCheck;
  db.chatrooms.find({"direct":true, "acceptedUsers": { "$size" : 2, "$all": chatroomParam.acceptedUsers }}, {"_id":1}, function(err, chatrooms)
    {
      if (err) deferred.reject(err);
      if(chatrooms.length > 0 && chatroomParam.direct == true)
      {
        directCheck = chatrooms[0]._id;
        if(directCheck){
          deferred.resolve(directCheck);
          return deferred.promise;
        }
      }
        else  {
        db.chatrooms.insert(
          {
            'name': chatroomParam.name,
            'acceptedUsers': chatroomParam.acceptedUsers,
            'pendingUsers': [],
            'messages': [],
            'private': chatroomParam.privateStatus,
            'direct': chatroomParam.direct,
            'maxUsers': chatroomParam.maxUsers
          },
          function (err, chatroom) {

            if (err) deferred.reject(err);
            if (chatroom) {
              deferred.resolve(chatroom._id);
            } else {
              deferred.resolve();
            }
          });
        }
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
        {$push: {'messages': {'author': chatroomParam.username, 'messageContent': chatroomParam.messageContent, 'timestamp': chatroomParam.timestamp}}},
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
    db.chatrooms.find
    (
        {_id: mongo.ObjectId(chatroomParam._id)},
        {"messages":1, "_id":0},
        function(err, docs)
        {
            if(err) deferred.reject(err);

            if(docs)
                deferred.resolve(docs);
            else
                deferred.resolve();
        }
    );
    return deferred.promise;
    //db.yourcollectionname.find({$query: {}, $orderby: {$natural : -1}}).limit(yournumber)  <-- something like this to get last N elements?
}

function getUsers(chatroomParam)
{
	var deferred = Q.defer();

	db.chatrooms.findOne({"_id": mongo.ObjectId(chatroomParam._id)}, {"acceptedUsers": 1, "pendingUsers": 1}, function (err, chatroom)
		{
			if (err) deferred.reject(err);

			if (chatroom)
				deferred.resolve(chatroom);
			else
				deferred.resolve();
		});

	return deferred.promise;
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
    db.chatroom.find({"id": mongo.ObjectId(chatroomParam._id), "pendingUsers": chatroomParam.username}, {"name":1}, function(err, docs)
        {
            if(docs.length > 0)
            {
                deferred.resolve();
            }
            else
            {
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
            }
        });

    return deferred.promise;
}

function _delete(chatroomParam) {
    var deferred = Q.defer();

    db.chatrooms.remove(
        { _id: mongo.ObjectId(chatroomParam) },
        function (err) {
            if (err) deferred.reject(err);

            deferred.resolve();
        });

    return deferred.promise;
}
