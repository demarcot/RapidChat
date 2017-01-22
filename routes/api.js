module.exports = function(app) {
    'use strict';
    var assert = require('assert');
    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;
    var ObjectId = mongodb.ObjectID;
    var myUrl = 'mongodb://localhost:27017/chat';
    MongoClient.connect(myUrl, function(err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server.");
      db.close();
    });






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
    res.send({Messages:[{"John":"Hello"},{"Jane":"Hello"},{"John":"How are you?"},{"Jane":"Great! Did you finish those reports?"},{"John":"Yes! All ready and submitted Mary"},{"Jane":"Fantastic! How was your Holiday?"}]});
  });
};
