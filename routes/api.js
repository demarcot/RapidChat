
module.exports = function(app) {
    'use strict';
    var assert = require('assert');
    var mongojs = require('mongojs');
    var myURL = 'mongodb://localhost:27017/rapidDB'

  /* GET users listing. */
  app.get('/api/test', function(req, res) {
    res.send([
      {
        a: 'b',
        c: 'd'
      }]);
  });
  app.get('/api/getMsgs', function(req, res) {
    //max message pull will be 50
    //res.send({Messages:[{"John":"Hello"},{"Jane":"Hello"},{"John":"How are you?"},{"Jane":"Great! Did you finish those reports?"},{"John":"Yes! All ready and submitted Mary"},{"Jane":"Fantastic! How was your Holiday?"}]});
    var db = mongojs(myURL, ['messages']);
	if(db != null)
	{
		console.log("Connected to database...");
	}

	db.messages.find(function(err, items)
	{
		if(err)
		{
			res.send(err);
		}
		res.json(items);
	});
  });

  app.get('/api/getUsers', function(req, res) {
    //max message pull will be 50
    //res.send({Messages:[{"John":"Hello"},{"Jane":"Hello"},{"John":"How are you?"},{"Jane":"Great! Did you finish those reports?"},{"John":"Yes! All ready and submitted Mary"},{"Jane":"Fantastic! How was your Holiday?"}]});
    var db = mongojs(myURL, ['users']);
  if(db != null)
  {
    console.log("Connected to database...");
  }

  db.users.find(function(err, items)
  {
    if(err)
    {
      res.send(err);
    }
    res.json(items);
  });
  });
};
