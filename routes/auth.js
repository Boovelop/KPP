const express = require('express');
const router = express.Router();
const axios = require('axios');
const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

require('dotenv').config();

const kakaoData = {
	accessToken: '',
};

passport.use(
	'kakao',
	new kakaoStrategy(
		{
			clientID: process.env.KAKAO_KEY,
			callbackURL: '/auth/kakao/callback',
		},
		async (accessToken, refreshToken, profile, done) => {
			console.log('accesstoken:', accessToken);

			kakaoData.accessToken = accessToken;
			console.log('userName:', profile);

			const user = await User.findOne({ where: { user_id: profile.id } });
			if (user) {
				if (user.user_name != profile.username) {
					user.update({
						user_name: profile.username,
						user_uniqueName: `${profile.username}(${profile.id})`,
					});
				}

				done(null, user);
			} else {
				const newUser = await User.create({
					login_type: 'kakao',
					user_id: profile.id,
					user_name: profile.username,
					user_uniqueName: `${profile.username}(${profile.id})`,
					user_email: profile._json.kakao_account.email,
				});
				done(null, newUser);
			}
		}
	)
);

router.get('/kakao', passport.authenticate('kakao'));

router.get(
	'/kakao/callback',
	passport.authenticate('kakao', {
		successRedirect: 'login/success',
		failureRedirect: 'login/fail',
	})
);

router.get('/kakao/login/success', function (req, res, next) {
	setkakaoUserSession(req.session, req.user, kakaoData.accessToken);

	// console.log(req.user); // 넘어온 유저 데이터 확인
	res.redirect(`/auth/kakao/login/success/front?user_name=${req.user.user_name}`);
});
router.get('/kakao/login/success/front', function (req, res, next) {
	let redirectPath = '/';
	if (req.session.returnTo) redirectPath = req.session.returnTo;

	res.send(
		`<script type='text/javascript'>alert('로그인 성공! ${req.query.user_name}님 어서오세요~!'); location.replace('${redirectPath}') </script>`
	);
});
router.get('/kakao/login/fail', function (req, res, next) {
	console.log(req.user);
	res.redirect(`/auth/kakao/login/fail/front`);
});
router.get('/kakao/login/fail/front', function (req, res, next) {
	res.send(`<script type="text/javascript">alert("로그인에 실패했습니다!"); location.replace("/") </script>`);
});

router.get('/loginCheck', async function (req, res, next) {
	try {
		const result = {};
		if (req.session.user_id) {
			result.isLogin = true;
			result.userName = req.session.user_name;
			result.user_uniqueName = req.session.user_uniqueName;
			res.status(200).send(result);
		} else {
			result.isLogin = false;
			res.status(200).send(result);
		}
	} catch (error) {
		next(error);
	}
});

router.get('/kakao/logout', function (req, res, next) {
	// 카카오계정과 함께 로그아웃 페이지로 이동(유저가 사이트 로그아웃과, 카카오 로그아웃 선택이 가능)

	// 로컬 호스트라면 포트번호를 추가해준다.
	let callbackRoute = '';
	if (req.hostname == 'localhost') {
		callbackRoute = `http://${req.hostname}:${process.env.PORT}/auth/kakao/logout/callback`;
	} else {
		callbackRoute = `http://${req.hostname}/auth/kakao/logout/callback`;
	}

	res.redirect(`https://kauth.kakao.com/oauth/logout?client_id=${process.env.KAKAO_KEY}&logout_redirect_uri=${callbackRoute}`);
});

router.get('/kakao/logout/callback', function (req, res, next) {
	res.redirect(`/auth/kakao/logout/success/front?user_name=${req.user.user_name}`);
});

router.get('/kakao/logout/success/front', function (req, res, next) {
	let redirectPath = '/';
	if (req.session.returnTo) redirectPath = req.session.returnTo;

	setkakaoUserSession(req.session, null);

	res.send(`<script>alert('로그아웃 성공! ${req.query.user_name}님 안녕히 가세요^^'); location.replace('${redirectPath}');</script>`);
});

function setkakaoUserSession(session, user, token) {
	if (user) {
		session.user_id = user.user_id;
		session.user_name = user.user_name;
		session.user_email = user.user_email;
		session.user_uniqueName = user.user_uniqueName;
		session.kakao_accessToken = token;
	} else {
		session.user_id = null;
		session.user_name = null;
		session.user_email = null;
		session.user_uniqueName = null;
		session.kakao_accessToken = null;
	}
}

module.exports = router;
