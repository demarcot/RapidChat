var config = require('config.json');
var express = require('express');
var router = express.Router();
var chatroomService = require('routes/services/chatroomAPIService');

// routes
router.get('/getAllChatrooms', getAllChatrooms);
router.post('/getAllowedChatrooms', getAllowedChatrooms);
router.post('/notifyCheck', notifyCheck);
router.post('/getById', getById);
router.post('/createChatroom', createChatroom);
router.delete('/:_id', deleteChatroom);
router.post('/getMessages', getMessages);
router.post('/insertMessage', insertMessage);
router.put('/inviteUser', inviteUser);

module.exports = router;

function getAllChatrooms(req, res)
{
	console.log("Get all chatrooms...\n");
	chatroomService.getAll()
	.then(function (chatrooms)
	{
		if(chatrooms)
			res.send(chatrooms);
		else
			res.sendStatus(404);
	})
	.catch(function (err)
	{
		res.status(400).send(err);
	});

}

function getById(req, res)
{

	var chatroomParam = {"_id": req.body._id}
	console.log("Get all chatrooms...\n");
	chatroomService.getById(chatroomParam)
	.then(function (chatrooms)
	{
		if(chatrooms)
			res.send(chatrooms);
		else
			res.sendStatus(404);
	})
	.catch(function (err)
	{
		res.status(400).send(err);
	});

}

function getAllowedChatrooms(req, res)
{
	var chatroomParam = {'username': req.body.username};

	console.log("Get allowed chatrooms...\n");
	chatroomService.getAllowedChatrooms(chatroomParam)
	.then(function (chatrooms)
	{
		if(chatrooms)
			res.send(chatrooms);
		else
			res.sendStatus(404);
	})
	.catch(function (err)
	{
		res.status(400).send(err);
	});

}

function notifyCheck(req, res)
{
	var chatroomParam = req.body.chatroomParam;
	
	console.log("Notify check...");
	chatroomService.notifyCheck(chatroomParam)
	.then(function (stat)
	{
		console.log("Chatroomparam ", chatroomParam);
		console.log("notifyCheck: ", stat);
		res.send(stat);
	})
	.catch(function (err)
	{
		res.status(400).send(err);
	});
}

function createChatroom(req, res)
{
	var chatroomParam = {'name': req.body.name, 'acceptedUsers': req.body.acceptedUsers, 'privateStatus': req.body.privateStatus, 'direct': req.body.direct, 'maxUsers': req.body.maxUsers}

	console.log("Create Chatroom:\n\tchatroomParam:\n\t", chatroomParam);
	chatroomService.create(chatroomParam)
	.then(function (chatroomId)
	{
		res.send(chatroomId);
	})
	.catch(function (err)
	{
		res.status(400).send(err);
	});
}

function deleteChatroom(req, res)
{
	var chatroomParam = {'_id': req.body._id};

	console.log("Delete Chatroom:\n\tchatroomParam:\n\t", chatroomParam);
    chatroomService.delete(chatroomParam)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getMessages(req, res)
{
	var chatroomParam = {'_id': req.body._id};

	console.log("Get Messages:\n\tchatroomParam:\n\t", chatroomParam);
	chatroomService.getMessages(chatroomParam)
	.then(function (messages)
	{
		if(messages)
			res.send(messages);
		else
			res.sendStatus(404);
	})
	.catch(function (err)
	{
		res.status(400).send(err);
	});
}

function insertMessage(req, res)
{
	var chatroomParam = {'_id': req.body._id, 'username': req.body.username, 'messageContent': req.body.messageContent, 'timestamp': req.body.timestamp};

	console.log("Insert Message:\n\tchatroomParam:\n\t", req.body);
	chatroomService.insertMessage(chatroomParam)
	.then(function ()
	{
		res.sendStatus(200);
	})
	.catch(function (err)
	{
		res.status(400).send(err);
	});
}

function inviteUser(req, res)
{
	var chatroomParam = {'_id': req.body._id, 'username': req.body.username};

	console.log("Invite User:\n\tchatroomParam:\n\t", chatroomParam);
	chatroomService.inviteUser(chatroomParam)
	.then(function ()
	{
		res.sendStatus(200);
	})
	.catch(function(err)
	{
		res.status(400).send(err);
	});
}
