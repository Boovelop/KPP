const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

router.get('/images', function (req, res, next) {
	// req.params
});

// 클라이언트에서 웹 스크래핑 요청이 있을 때 호출
router.get('/scraping', function (req, res, next) {
	const url = req.query.url;
	console.log('--- url : ', url);

	axios
		.get(url, {
			encoding: null,
			responseType: 'arraybuffer',
		})
		.then(function (html) {
			try {
				// 컨텐츠 타입 확인 : text/html;charset=EUC-KR
				const charset = charsetFinder(html.headers);
				let $ = '';
				if (charset !== 'utf-8') $ = cheerio.load(iconv.decode(html.data, charset));
				else $ = cheerio.load(html.data);

				const result = {};
				result.name = $('#middle > div.h_company > div.wrap_company > h2 > a').text();
				result.todayCost = $('#content > div.section.trade_compare > table > tbody > tr:nth-child(1) > td:nth-child(2)').text();
				result.variance = $('#content > div.section.trade_compare > table > tbody > tr:nth-child(2) > td:nth-child(2) > em').text();
				result.fluctuationRate = $('#content > div.section.trade_compare > table > tbody > tr:nth-child(3) > td:nth-child(2) > em').text();
				// 숫자 및 ,만 추출
				const value = result.variance.replace(/[^0-9,]/g, '');
				// 한글만 추출 (초성 제외)
				const text = result.variance.replace(/[^가-힣]/g, '');
				console.log(value);
				console.log(text);
				console.log(result.variance);

				res.status(200).send(result);
			} catch (error) {
				console.error(error);
			}
		});
});

module.exports = router;

function charsetFinder(header) {
	const contentType = header['content-type'];
	const findText = 'charset=';
	const findIndex = contentType.indexOf(findText);
	if (findIndex == -1) return null;

	const result = contentType.substring(findIndex + findText.length, contentType.length);
	return result;
}
