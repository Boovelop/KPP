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
            // responseType: 'arraybuffer',
        })
        .then(function (html) {
            try {
                // 컨텐츠 타입 확인 : text/html;charset=EUC-KR
                const contentType = html.headers['content-type'];
                let $ = null;

                let charset = 'EUC-KR';
                if (contentType.includes(charset)) {
                    // $ = cheerio.load(iconv.decode(html.data, charset));
                    // $ = cheerio.load(iconv.decode(html.data, charset));
                }
                $ = cheerio.load(html.data);

                const todayValue = $('#tab_con1 > div.first > table > tbody > tr:nth-child(2) > td');
                // $('#chart_area > div.rate_info > div > p.no_today').text()
                // console.log(todayValue);
                res.status(200).send(JSON.parse(todayValue));
            } catch (error) {
                console.error(error);
            }
        });
});

module.exports = router;
