const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const imageSize = require('image-size');
const { error } = require('console');

// 요청한 경로의 폴더 내부에 있는 모든 파일 데이터를 전달해주는 라우트
router.get('/dir', async function (req, res, next) {
    const dir = req.query.dir;
    try {
        // 경로가 존재하는지 확인한다.
        if (fs.existsSync(dir)) {
            // 경로안의 파일들의 이름을 읽어온다.
            const readFilesName = await fs.readdirSync(dir);
            res.status(200).send(readFilesName);
        } else res.status(204).send(null);
    } catch (error) {
        next(error);
    }
});

// 요청한 경로와 파일명으로 파일 데이터를 전달해주는 라우트
router.get('/file', function (req, res, next) {
    const path = req.query.dir + '/' + req.query.fileName;

    try {
        if (fs.existsSync(req.query.dir)) {
            fs.readFile(path, 'utf8', function (err, data) {
                if (err) {
                    console.error(err);
                } else {
                    res.status(200).send(data);
                }
            });
        } else res.status(204).send(null);
    } catch (error) {
        next(error);
    }
});

const uploadFolderPath = './public/uploads';
// uploads 폴더가 있는지 확인하고 없으면 생성한다.
try {
    fs.readdirSync(uploadFolderPath);
} catch (err) {
    fs.mkdirSync(uploadFolderPath);
}
const imgUpload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            // 업로드하는 유저의 폴더를 확인, 없으면 생성
            const folderName = req.session.user_id;
            const folderPath = uploadFolderPath + '/' + folderName;
            try {
                fs.readdirSync(folderPath);
            } catch (error) {
                fs.mkdirSync(folderPath);
            }
            done(null, folderPath);
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            const baseName = path.basename(file.originalname, ext);
            done(null, baseName + '_' + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});
const resizeImg = async function (req, res, next) {
    try {
        if (!req.file || req.session.user_id == null) return next();

        // 이미지의 width와 height 사이즈
        const rectSize = imageSize(req.file.path);

        // width가 1024를 초과한다면 크기를 조정해서 저장한다.
        if (rectSize.width > 1024) {
            // 새로 저장할 경로 및 이름 지정
            const newPath = req.file.destination + '/_' + req.file.filename;
            // 리사이징
            await sharp(req.file.path)
                .resize({ width: 1024 })
                .toFile(newPath, function (err, info) {
                    if (err) throw err;

                    // 기존 파일 삭제
                    fs.unlink(req.file.path, function (err) {
                        if (err) throw err;

                        // 리사이징된 파일 이름 기존이름으로 변경
                        fs.rename(newPath, req.file.path, function (err) {
                            if (err) throw err;
                        });
                    });
                });
        }
    } catch (error) {
        next(error);
    }

    next();
};
router.post('/file/image', function (req, res, next) {
    try {
        if (req.session.user_id != null) {
            next();
        }
        console.log('세션의 아이디가 없어서 이미지 업로드를 할 수 없음');
    } catch (error) {
        next(error);
    }
});
router.post('/file/image', imgUpload.single('img'), resizeImg, function (req, res, next) {
    try {
        console.log(req.file);
        res.status(200).send(req.file);
    } catch (error) {
        next(error);
    }
});

// 클라이언트에서 웹 스크래핑 요청이 있을 때 호출
router.get('/scraping', function (req, res, next) {
    const url = req.query.url;
    const scrapingType = req.query.type;

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

                let result = null;
                switch (scrapingType) {
                    case 'stock':
                        result = scrapingStock($);
                        break;

                    default:
                        res.status(404).send({ result: 'error' });
                        break;
                }

                res.status(200).send(result);
            } catch (error) {
                console.error(error);
            }
        });
});

function charsetFinder(header) {
    const contentType = header['content-type'];
    const findText = 'charset=';
    const findIndex = contentType.indexOf(findText);
    if (findIndex == -1) return null;

    const result = contentType.substring(findIndex + findText.length, contentType.length);
    return result;
}

function scrapingStock($) {
    const result = {};

    result.name = $('#middle > div.h_company > div.wrap_company > h2 > a').text();
    result.nowVal = $('#_nowVal').text();
    result.diffVal = $('#_diff > span')
        .text()
        .replace(/(\n\r|\n\t|\r\t|\n|\t|\r)/gm, '');
    result.rate = $('#_rate > span')
        .text()
        .replace(/(\n\r|\n\t|\r\t|\n|\t|\r)/gm, '');

    // 숫자 및 ',' 추출
    // const value = result.variance.replace(/[^0-9,]/g, '');

    // 한글만 추출 (초성 제외)
    // const text = result.variance.replace(/[^가-힣]/g, '');

    // 공백 제거
    // replace(/(\n\r|\n\t|\r\t|\n|\t|\r)/gm, '');

    return result;
}

module.exports = router;
