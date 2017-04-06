var config = require('config.json');
var express = require('express');
var router = express.Router();
var chatroomService = require('routes/services/chatroomAPIService');

// routes
router.get('/getAllChatrooms', getAllChatrooms);
router.post('/getAllowedChatrooms', getAllowedChatrooms);
router.get('/getPublicAndPrivate', getPublicAndPrivate);
router.post('/notifyCheck', notifyCheck);
router.post('/getById', getById);
router.post('/createChatroom', createChatroom);
router.delete('/:_id', deleteChatroom);
router.post('/getMessages', getMessages);
router.post('/getUsers', getUsers);
router.post('/insertMessage', insertMessage);
router.post('/moveToAccepted', moveToAccepted);
router.post('/removeFromAccepted', removeFromAccepted);
router.post('/inviteUser', inviteUser);
router.post('/checkPending', checkPending);

module.exports = router;

function getAllChatrooms(req, res)
{

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

function getPublicAndPrivate(req, res)
{
    chatroomService.getPublicAndPrivate()
    .then(function (chatrooms)
    {
        if(chatrooms)
            res.send(chatrooms);
        else
            res.sendStatus(404);
    })
    .catch(function(err)
    {
        res.status(400).send(err);
    });
}

function notifyCheck(req, res)
{
	var chatroomParam = {"chatroomId": req.body._id, "username": req.body.username};


	chatroomService.notifyCheck(chatroomParam)
	.then(function (stat)
	{

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
	var chatroomParam = req.params._id;

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

function getUsers(req, res)
{
	var chatroomParam = {"_id": req.body._id};

	chatroomService.getUsers(chatroomParam)
	.then(function (users)
	{
		if(users)
			res.send(users);
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

function moveToAccepted(req, res)
{
	var chatroomParam = {"_id": req.body._id, "username": req.body.username};

	chatroomService.moveToAccepted(chatroomParam)
	.then(function (ret)
	{
		res.send(ret);
	})
	.catch(function(err)
	{
		console.log("Move to accepted error: ", err);
		res.status(400).send(err);
	});
}

function removeFromAccepted(req, res)
{
	var chatroomParam = {"_id": req.body._id, "username": req.body.username};
	console.log("API", req.body.username);
	chatroomService.removeFromAccepted(chatroomParam)
	.then(function (ret)
	{
		res.send(ret);
	})
	.catch(function(err)
	{
		res.status(400).send(err);
	});
}

function checkPending(req, res)
{
    var chatroomParam = {'username': req.body.username};

    chatroomService.checkPending(chatroomParam)
    .then(function(rooms)
    {
        if(rooms)
            res.send(rooms);
        else
            res.send(false);
    })
    .catch(function (err)
    {
        res.status(400).send(err);
    });
}
