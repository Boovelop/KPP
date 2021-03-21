const express = require('express');
const router = express.Router();
const Board = require('../models/board');

// ------- 게시판 라우트 ------- //
router
	.route('/')
	// 게시판 데이터 모두 조회
	.get(async function (req, res, next) {
		try {
			const boards = await Board.findAll({
				attributes: ['author', 'title', 'created_at', 'views'],
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
			// const board = await Board.findOne({
			// 	where:
			// })
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
		} catch (error) {
			next(error);
		}
	})
	// 게시판 글 삭제
	.delete(async function (req, res, next) {
		try {
		} catch (error) {
			next(error);
		}
	});

module.exports = router;