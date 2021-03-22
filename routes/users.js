const express = require('express');
const router = express.Router();

const User = require('../models/user');

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
    // 유저 수정(전체 수정, 전달 받지 않은 데이터는 default로 바뀜)
    .put(async function (req, res, next) {
        try {
        } catch (error) {
            console.log(error);
            next(error);
        }
    })
    // 유저 수정(부분 수정)
    .patch(async function (req, res, next) {
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

router.get('/single', async function (req, res, next) {
    if (req.session.user_id) {
        const user = await User.findOne({
            where: { user_id: req.session.user_id },
        });

        if (user) res.status(200).send(user);
        else res.status(204).send();
    } else res.status(204).send();
});

module.exports = router;
