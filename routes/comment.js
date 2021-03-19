const express = require('express');
const router = express.Router();

// ------- 댓글 라우트 ------- //
router
	.route('/')
	// 해당 게시판의 댓글 모두 조회
	.get(async function (req, res, next) {
		try {
		} catch (error) {
			next(error);
		}
	})
	// 댓글 추가
	.post(async function (req, res, next) {
		try {
		} catch (error) {
			next(error);
		}
	})
	// 댓글 수정
	.patch(async function (req, res, next) {
		try {
		} catch (error) {
			next(error);
		}
	})
	// 댓글 삭제
	.delete(async function (req, res, next) {
		try {
		} catch (error) {
			next(error);
		}
	});

// -------- 응원글 목록 -------- //
router
	.route('/cheering')
	// 응원 댓글 모두 조회
	.get(async function (req, res, next) {
		try {
		} catch (error) {
			next(error);
		}
	})
	// 응원 댓글 추가 ( 한 아이디에 1개만 작성 가능 )
	.post(async function (req, res, next) {
		try {
		} catch (error) {
			next(error);
		}
	})
	// 응원 댓글 수정
	.patch(async function (req, res, next) {
		try {
		} catch (error) {
			next(error);
		}
	})
	// 응원 댓글 삭제
	.delete(async function (req, res, next) {
		try {
		} catch (error) {
			next(error);
		}
	});
module.exports = router;
