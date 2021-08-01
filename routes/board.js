const express = require('express');
const router = express.Router();
const fs = require('fs');
const Board = require('../models/board');

// ------- 게시판 라우트 ------- //
router
    .route('/')
    // 게시판 데이터 모두 조회
    .get(async function (req, res, next) {
        try {
            const boards = await Board.findAll({
                attributes: ['id', 'author', 'title', 'created_at', 'views'],
            });
            if (boards) res.status(200).send(boards);
            else res.status(404).send({ result: 'fail' });
        } catch (error) {
            next(error);
        }
    })
    // 게시판 단일 조회
    .search(async function (req, res, next) {
        try {
            const board = await Board.findOne({
                where: { id: req.session.selectedBoardId },
            });
            board.returnTo = req.session.returnTo;

            res.status(200).send(board);
        } catch (error) {
            next(error);
        }
    })
    // 게시판 글 추가
    .post(async function (req, res, next) {
        try {
            const reqData = req.body;
            const imageFiles = '';

            const newBoard = await Board.create({
                title: reqData.title,
                text: reqData.text,
                image_files: imageFiles,
                author: reqData.author,
            });

            if (newBoard) res.status(200).send({ result: 'success' });
            else res.status(404).send({ result: 'fail' });
        } catch (error) {
            next(error);
        }
    })
    // 게시판 글 수정
    .patch(async function (req, res, next) {
        try {
            const board = await Board.update(
                {
                    title: req.body.title,
                    text: req.body.text,
                },
                {
                    where: { id: req.body.id },
                }
            );
            if (board) res.status(200).send({ result: 'success' });
            else res.status(204).send();
        } catch (error) {
            next(error);
        }
    })
    // 게시판 글 삭제
    .delete(async function (req, res, next) {
        try {
            console.log('id:', req.body);
            if (req.body.id) {
                const board = await Board.destroy({
                    where: { id: req.body.id },
                });

                if (board) res.status(200).send({ result: 'success' });
                else res.status(204).send();
            }
        } catch (error) {
            next(error);
        }
    });

module.exports = router;
