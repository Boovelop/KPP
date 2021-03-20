const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
	req.session.returnTo = req.path;
	res.render('./main.pug', { title: 'KPP - K-POP Pen Site', session_userId: req.session.userId });
});

router.get('/kpop', function (req, res, next) {
	req.session.returnTo = req.path;
	res.render('./kpop.pug', { title: 'KPP - K-POP', session_userId: req.session.userId });
});

router.get('/community', function (req, res, next) {
	req.session.returnTo = req.path;
	res.render('./community.pug', { title: 'KPP - Community', session_userId: req.session.userId });
});

router.get('/store', function (req, res, next) {
	req.session.returnTo = req.path;
	res.render('./store.pug', { title: 'KPP - Store', session_userId: req.session.userId });
});

router.get('/signup', function (req, res, next) {
	req.session.returnTo = req.path;
	res.render('./signup.pug', { title: 'KPP - Signup' });
});

router.get('/write', function (req, res, next) {
	req.session.returnTo = req.path;
	res.render('./write.pug', { title: 'KPP - Write' });
});

module.exports = router;
