const express = require('express');
const router = express.Router();
const Board = require('../models/board');

router.get('/', function (req, res, next) {
  req.session.returnTo = req.path;
  res.render('./main.pug', { title: 'KPP - K-POP People' });
});

router.get('/kpop', function (req, res, next) {
  req.session.returnTo = req.path;
  res.render('./kpop.pug', { title: 'KPP - K-POP' });
});

router.get('/community', function (req, res, next) {
  req.session.returnTo = req.path;
  res.render('./community.pug', {
    title: 'KPP - Community',
    userUniqueName: req.session.user_uniqueName,
    userColor: req.session.color,
  });
});

router.get('/store', function (req, res, next) {
  req.session.returnTo = req.path;
  res.render('./store.pug', { title: 'KPP - Store' });
});

router.get('/write', function (req, res, next) {
  req.session.returnTo = req.path;
  res.render('./board.pug', {
    title: 'KPP - Write',
    author: req.session.user_uniqueName,
    boardState: 'write',
  });
});

router.get('/read', async function (req, res, next) {
  req.session.returnTo = `${req.path}?id=${req.query.id}&title=${req.query.title}`;
  req.session.selectedBoardId = req.query.id;

  const board = await Board.findOne({
    where: { id: req.query.id },
  });
  board?.increment('views', { by: 1 });
  res.render('./board.pug', {
    title: 'KPP - ' + req.query.title,
    boardState: 'read',
  });
});

module.exports = router;
