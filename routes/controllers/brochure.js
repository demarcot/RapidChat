var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');


router.get('/', function (req, res) {
    res.render('brochure');
});

module.exports = router;
