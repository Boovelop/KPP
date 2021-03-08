const express = require('express');
const router = express.Router();

const mainPage = require('../models/mainPage');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render(mainPage.staticFilePath, mainPage);
});

module.exports = router;
