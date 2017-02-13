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
	chatroomService.getById(req.???)
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
	chatroomService.create(req.???)
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
    chatroomService.delete(req.???)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getMessages(req, res)
{
	chatroomService.getMessages(req.???, req.???)
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
	chatroomService.insertMessage(req.???, req.???)
	.then(function ()
	{
		res.sendStatus(200);
	})
	.catch(function (err)
	{
		res.status(400).send(err);
	});
}
