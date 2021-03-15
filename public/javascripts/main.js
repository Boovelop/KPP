const mainObj = {
    video: {
        element: HTMLElement,
        currentIdx: 0,
        sources: ['./videos/iu_celebrity.webm', './videos/bts_dynamite.webm', './videos/twice_TT.webm', './videos/볼빨간사춘기_우주를줄게.webm'],
    },
    stock: {
        datas: [],
        datasMax: 0,
        interval: null,
    },
};

window.addEventListener('load', function () {
    main_headerPositionAbsolute();
    main_initSlick();
    main_initVideo();

    setTimeout(main_stockSet, 200);
});

function main_headerPositionAbsolute() {
    document.getElementById('header-logo').classList.add('absolute');
}

function main_initSlick() {
    $('.album-slick').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        Infinity: true,
        centerMode: true,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 3000, // 자동 스크롤 시 다음으로 넘어가는데 걸리는 시간 (ms)
        pauseOnHover: true, // 슬라이드 이동 시 마우스 호버하면 슬라이더 멈추게 설정

        responsive: [
            {
                breakpoint: 960, //화면 사이즈 960px
                settings: {
                    //위에 옵션이 디폴트 , 여기에 추가하면 그걸로 변경
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 768, //화면 사이즈 768px
                settings: {
                    //위에 옵션이 디폴트 , 여기에 추가하면 그걸로 변경
                    slidesToShow: 2,
                },
            },
        ],
    });
}
function main_initVideo() {
    const video = document.querySelector('#section-video>video');
    mainObj.video.element = video;

    const randVal = Math.round(Math.random() * (mainObj.video.sources.length - 1));
    mainObj.video.currentIdx = randVal;

    video.src = mainObj.video.sources[randVal];

    video.load();
    video.addEventListener('ended', main_videoChange);
}
function main_videoChange(e) {
    const nextIdx = mainObj.video.currentIdx + 1;
    const setIdx = nextIdx >= mainObj.video.sources.length ? 0 : nextIdx;
    mainObj.video.currentIdx = setIdx;
    mainObj.video.element.src = mainObj.video.sources[setIdx];
    mainObj.video.element.load();
}

// 주가 스크래핑 데이터 설정
function main_stockSet() {
    // 데이터 비동기처리의 완료를 찾기위해 max값을 설정
    mainObj.stock.datasMax = 4;

    // node에 스크래핑을 요청해서 주가 데이터를 받아온다.
    common_getScraping('https://finance.naver.com/item/sise.nhn?code=035900', 'stock').then(function (res) {
        mainObj.stock.datas.push(res);
        mainObj.stock.resSuccessCnt++;
    });

    common_getScraping('https://finance.naver.com/item/sise.nhn?code=352820', 'stock').then(function (res) {
        mainObj.stock.datas.push(res);
        mainObj.stock.resSuccessCnt++;
    });

    common_getScraping('https://finance.naver.com/item/sise.nhn?code=122870', 'stock').then(function (res) {
        mainObj.stock.datas.push(res);
        mainObj.stock.resSuccessCnt++;
    });

    common_getScraping('https://finance.naver.com/item/sise.nhn?code=041510', 'stock').then(function (res) {
        mainObj.stock.datas.push(res);
        mainObj.stock.resSuccessCnt++;
    });

    // 위의 비동기 처리가 모두 완료된 것을 확인하고 동작을 수행하는 루틴
    mainObj.stock.interval = setInterval(() => {
        if (mainObj.stock.datas.length == mainObj.stock.datasMax) {
            stockRollingText();
            clearInterval(mainObj.stock.interval);
        }
    }, 200);
}

class rolling {
    constructor(element, name, nowVal, diffVal, rate) {
        this.element = element;
        this.children = {
            name: name,
            nowVal: nowVal,
            diffVal: diffVal,
            rate: rate,
        };
    }
}
function stockRollingText() {
    const timer = 2500; // 롤링되는 주기(ms)

    const first = new rolling();
    first.element = document.getElementById('rolling-first');
    first.children.name = element.children('.stock-name');
    first.children.nowVal = element.children('.stock-nowVal');
    first.children.diffVal = element.children('.stock-diffVal');
    first.children.rate = element.children('.stock-rate');

    console.log(first);
    // const second = document.getElementById('rolling-second'),
    //     third = document.getElementById('rolling-third');

    // const first_name = first.children('.stock-name');
    // const first_nowVal = first.children('.stock-nowVal');
    // const first_diffVal = first.children('.stock-diffVal');
    // const first_rate = first.children('.stock-rate');

    // first.children[0].innerHTML = `${mainObj.stock.datas[0].name} \t ${mainObj.stock.datas[0].nowVal} \t ${mainObj.stock.datas[0].diffVal} \t ${mainObj.stock.datas[0].rate}`;

    // setInterval(() => {
    //     if (move == 2) {
    //         first.classList.remove('card-sliding');
    //         first.classList.add('card-sliding-after');

    //         second.classList.remove('card-sliding-after');
    //         second.classList.add('card-sliding');

    //         third.classList.remove('card-sliding-after');
    //         third.classList.remove('card-sliding');

    //         move = 0;
    //     } else if (move == 1) {
    //         first.classList.remove('card-sliding-after');
    //         first.classList.add('card-sliding');

    //         second.classList.remove('card-sliding-after');
    //         second.classList.remove('card-sliding');

    //         third.classList.remove('card-sliding');
    //         third.classList.add('card-sliding-after');

    //         move = 2;
    //     } else if (move == 0) {
    //         first.classList.remove('card-sliding-after');
    //         first.classList.remove('card-sliding');

    //         second.classList.remove('card-sliding');
    //         second.classList.add('card-sliding-after');

    //         third.classList.remove('card-sliding-after');
    //         third.classList.add('card-sliding');

    //         move = 1;
    //     }

    //     let innerHTML = `${mainObj.stock.datas[dataCnt].name} \t ${mainObj.stock.datas[dataCnt].nowVal} \t ${mainObj.stock.datas[dataCnt].diffVal} \t ${mainObj.stock.datas[dataCnt].rate}`;
    //     if (dataCnt < mainObj.stock.datas.length - 1) {
    //         rollingBox.children[listCnt].children[0].innerHTML = innerHTML;
    //         dataCnt++;
    //     } else if (dataCnt == mainObj.stock.datas.length - 1) {
    //         rollingBox.children[listCnt].children[0].innerHTML = innerHTML;
    //         dataCnt = 0;
    //     }

    //     if (listCnt < 2) {
    //         listCnt++;
    //     } else if (listCnt == 2) {
    //         listCnt = 0;
    //     }

    //     console.log(listCnt);
    // }, timer);
}
