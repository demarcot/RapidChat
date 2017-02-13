var config = require('config.json');
var express = require('express');
var router = express.Router();
var chatroomService = require('routes/services/chatroomAPIService');

// routes
router.get('/getChatroom', getChatroom);
router.post('/createChatroom', createChatroom);
router.delete('/:_id', deleteChatroom);
router.get('/getMessages', getMessages);
router.put('/insertMessage', insertMessage);

module.exports = router;

function getChatroom(req, res)
{
	console.log("getChatroom: ", req);
	chatroomService.getById(req)
	.then(function (chatroom)
	{
		if(chatroom)
			res.send(chatroom);
		else
			res.sendStatus(404);
	})
	.catch(function (err)
	{
		res.status(400).send(err);
	});

}

function createChatroom(req, res)
{
	console.log("createChatroom: ", req.body.name);
	chatroomService.create(req.body)
	.then(function ()
	{
		res.sendStatus(200);
	})
	.catch(function (err)
	{
		res.status(400).send(err);
	});
}

function deleteChatroom(req, res)
{
	console.log("deleteChatroom: ", req);
    chatroomService.delete(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getMessages(req, res)
{
	console.log("getMessages: ", req);
	chatroomService.getMessages(req, req)
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
	console.log("insertMessage: ", req);
	chatroomService.insertMessage(req, req)
	.then(function ()
	{
		res.sendStatus(200);
	})
	.catch(function (err)
	{
		res.status(400).send(err);
	});
}
