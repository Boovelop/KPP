const fs = require('fs');

// 메인페이지 모델링 클래스 설계
class mainPage {
    constructor() {
        // static 설정이 현재 public으로 되어 있다는 전재하의 fielPath
        this.staticFilePath = './mainPage/index';
        this.title = 'KPP - K-Pop Pen Site';

        this.album = {
            fileDir: './public/images/albums/',
            staticFileDir: './images/albums/',
            fileNames: [],
        };
    }
}

const model = new mainPage();

// 이미지 파일 캐싱
fs.readdir(model.album.fileDir, function (err, data) {
    if (err) throw err;
    model.album.fileNames = data;
});

module.exports = model;
