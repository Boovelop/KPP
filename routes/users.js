const express = require('express');
const router = express.Router();

const User = require('../models/users');

/* GET users listing. */
router
    .route('/')
    // 모든 유저의 데이터 받아오기
    .get(async function (req, res, next) {
        try {
            const users = await User.findAll();
        } catch (error) {
            console.log(error);
            next(error);
        }
    })
    // 유저 추가(회원가입)
    .post(async function (req, res, next) {
        try {
        } catch (error) {
            console.log(error);
            next(error);
        }
    })
    // 유저 조회(단일)
    .search(async function (req, res, next) {
        try {
        } catch (error) {
            console.log(error);
            next(error);
        }
    })
    // 유저 삭제
    .delete(async function (req, res, next) {
        try {
        } catch (error) {
            console.log(error);
            next(error);
        }
    });

// 로그인 확인
router.get('/loginCheck', async function (req, res, next) {
    try {
        if (req.session.userId) {
            res.status(200).send(req.session.userId);
        } else {
            res.status(204).send({ tt: 'ddd', dd: 'dododo' });
        }
    } catch (error) {
        next(error);
    }
});
module.exports = router;
