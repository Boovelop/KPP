const express = require('express');
const router = express.Router();
const axios = require('axios');
const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;
const User = require('../models/user');

require('dotenv').config();

passport.use(
    'kakao',
    new kakaoStrategy(
        {
            clientID: process.env.KAKAO_CLIENT_ID,
            callbackURL: '/auth/kakao/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            // session.user_id = profile.id;
            // session.user_name = profile.username;
            // session.kakao_accessToken = accessToken;
            console.log('accesstoken:', accessToken);

            const user = await User.findOne({ user_id: profile.id });
            if (user) {
                // 유저의 프로필 이름이 변경 되었으면??
                // 게시판들의 이름도 수정해야 하나마나, 결정이 필요
                done(null, user);
            } else {
                const newUser = await User.create({
                    user_id: profile.id,
                    user_name: profile.username,
                });
                return done(null, newUser);
            }
        }
    )
);

router.get('/kakao', passport.authenticate('kakao'));

router.get(
    '/kakao/callback',
    passport.authenticate('kakao', {
        successRedirect: '/auth/login/success',
        failureRedirect: '/auth/login/fail',
    }),
    (res, req) => {
        console.log('asdfsdff2222');
        res.redirect('/auth');
    }
);

router.get('login/success', function (req, res, next) {
    console.log('성공');
});
router.get('login/fail', function (req, res, next) {
    console.log('실패');
});

router.get('/loginCheck', async function (req, res, next) {
    try {
        console.log('session:', req.session.user_id);
        if (req.session.user_id) {
            res.status(200).send({ result: true });
        } else {
            res.status(200).send({ result: false });
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
            Authorization: `Bearer ${session.kakao_accessToken}`,
        },
    })
        .then(function (response) {
            // 로그아웃 성공
            // console.log(response.data);
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
