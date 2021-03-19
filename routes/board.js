const express = require('express');
const router = express.Router();

// ------- 게시판 라우트 ------- //
router
	.route('/')
	// 게시판 데이터 모두 조회
	.get(async function (req, res, next) {
		try {
		} catch (error) {
			next(error);
		}
	})
	// 게시판 단일 조회
	.search(async function (req, res, next) {
		try {
		} catch (error) {
			next(error);
		}
	})
	// 게시판 글 추가
	.post(async function (req, res, next) {
		try {
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
