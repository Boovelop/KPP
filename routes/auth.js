const express = require('express');
const router = express.Router();
const axios = require('axios');
const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;
// const url = require('url');

const User = require('../models/user');

require('dotenv').config();

const kakaoData = {
    accessToken: '',
};

passport.use(
    'kakao',
    new kakaoStrategy(
        {
            clientID: process.env.KAKAO_CLIENT_ID,
            callbackURL: '/auth/kakao/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log('accesstoken:', accessToken);

            kakaoData.accessToken = accessToken;
            const user = await User.findOne({ where: { user_id: profile.id } });
            if (user) {
                // 유저의 프로필 이름이 변경 되었으면??
                // 게시판들의 이름도 수정해야 하나마나, 결정이 필요
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
    console.log('카카오 로그인 성공');
    console.log(req.user);
    res.redirect('/');
});
router.get('/kakao/login/fail', function (req, res, next) {
    console.log('카카오 로그인 실패');
    console.log(req.user);
    res.redirect('/');
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
    axios({
        url: 'https://kapi.kakao.com/v1/user/logout',
        method: 'post',
        headers: {
            Authorization: `Bearer ${req.session.kakao_accessToken}`,
        },
    })
        .then(function (response) {
            // 로그아웃 성공
            console.log('kakao logout success');
            console.log(response.data);
            req.session.destroy();
            res.redirect('/');
        })
        .catch(function (err) {
            // 로그아웃 실패
            console.error(err.response.data);
        });
});
router.get('/kakao/logout/callback', function (req, res, next) {
    try {
    } catch (error) {
        next(error);
    }
});

module.exports = router;
