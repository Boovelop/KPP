const express = require('express');
const router = express.Router();
const axios = require('axios');
const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');
const { query } = require('express');

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

            const user = await User.findOne({ where: { user_id: profile.id } });
            if (user) {
                done(null, user);
            } else {
                const newUser = await User.create({
                    login_type: 'kakao',
                    user_id: profile.id,
                    user_name: profile.username,
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
    req.session.user_id = req.user.user_id;
    req.session.user_name = req.user.user_name;
    req.session.kakao_accessToken = kakaoData.accessToken;

    // console.log(req.user); // 넘어온 유저 데이터 확인
    res.redirect(`/auth/kakao/login/success/front?user_name=${req.user.user_name}`);
});
router.get('/kakao/login/success/front', function (req, res, next) {
    res.send(`<script type="text/javascript">alert("로그인 성공! ${req.query.user_name}님 어서오세요~!"); location.replace("/") </script>`);
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
        console.log('logincheck user_id:', req.session.user_id);
        console.log('logincheck user_name:', req.session.user_name);

        const result = {};
        if (req.session.user_id) {
            result.isLogin = true;
            result.userName = req.session.user_name;
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
    // 사용자 토큰을 없애는 것, 현재 사이트에서만의 로그아웃, 카카오 계정의 로그아웃과는 다름
    axios({
        url: 'https://kapi.kakao.com/v1/user/logout',
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${req.session.kakao_accessToken}`,
        },
    })
        .then(function (response) {
            // 로그아웃 성공
            console.log('kakao logout success');
            console.log('logout response :', response.data);
            const userName = req.session.user_name;
            req.session.destroy();

            res.redirect(`/auth/kakao/logout/success/front?user_name=${userName}`);
        })
        .catch(function (err) {
            // 로그아웃 실패
            console.error(err.response.data);
        });
});

router.get('/kakao/logout/callback', function (req, res, next) {
    console.log('kakao logout success');
    console.log('logout response :', res);
    req.session.destroy();

    res.redirect('/auth/kakao/logout/success/front');
});

router.get('/kakao/logout/success/front', function (req, res, next) {
    res.send(`<script type="text/javascript">alert('로그아웃 성공! ${req.query.user_name}님 안녕히 가세요^^'); location.replace('/'); </script>`);
});

module.exports = router;

// 카카오계정과 함께 로그아웃 페이지로 이동(유저가 사이트 로그아웃과, 카카오 로그아웃 선택이 가능)
// res.redirect(
// 	`https://kauth.kakao.com/oauth/logout?client_id=${process.env.KAKAO_KEY}&logout_redirect_uri=http://localhost/auth/kakao/logout/callback`
// );
