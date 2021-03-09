const fs = require('fs');

// 모델링 클래스 설계
class modelMainPage {
    constructor() {
        this.title = 'KPP - K-POP Pen Site';

        this.album = {
            fileDir: './public/images/albums/',
            staticFileDir: './images/albums/',
            fileNames: [],
        };
    }
}

const model = new modelMainPage();

// 이미지 파일 캐싱
fs.readdir(model.album.fileDir, function (err, data) {
    if (err) throw err;
    model.album.fileNames = data;
});

module.exports = model;
