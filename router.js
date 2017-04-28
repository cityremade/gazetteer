var express = require('express');
var router = express.Router();
var queries = require('./queries');

router.get('/', function (req, res) {
        res.render('index');
});

router.get('/googleAddressQuery', queries.googleAddressQuery);

module.exports = router;