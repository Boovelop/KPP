const mainObj = {
  video: {
    element: HTMLElement,
    currentIdx: 0,
    sources: [
      './videos/iu_celebrity.webm',
      './videos/bts_dynamite.webm',
      './videos/twice_TT.webm',
      './videos/볼빨간사춘기_우주를줄게.webm',
    ],
  },
  stock: {
    datas: [],
    datasMax: 0,
    interval: null,
  },
  album: {
    jsonData: null,
  },
};

window.addEventListener('load', function () {
  history.scrollRestoration = 'manual';
  // history.scrollRestoration = 'auto';

  main_headerPositionAbsolute();
  main_initVideo();
  setTimeout(main_initAlbum, 10);
  setTimeout(main_bgRandomSet, 20);
  setTimeout(main_initStock, 30);
});

function main_headerPositionAbsolute() {
  document.getElementById('header-logo').style.position = 'absolute';
}

function main_initVideo() {
  const video = document.querySelector('#section-video>video');
  mainObj.video.element = video;

  const randVal = getRandomInt(0, mainObj.video.sources.length - 1);
  mainObj.video.currentIdx = randVal;

  video.src = mainObj.video.sources[randVal];

  video.load();
  video.addEventListener('ended', main_videoChange);
}

function main_initAlbum() {
  getFiles('./public/images/albums').then(function (res) {
    // 배열의 형태로 데이터가 들어온다.
    if (res) {
      // 태그 생성 및 리소스 설정
      const slickRoot = document.querySelector('.album-slick');

      let slickList, slickContent, slickImg, slickAlbumName, slickAlbumNameBg;

      for (let i = 0; i < res.length; i++) {
        slickList = document.createElement('div');

        slickContent = document.createElement('div');
        slickContent.classList.add('slick-content');

        slickImg = document.createElement('img');
        slickImg.src = `./images/albums/${res[i]}`;

        slickAlbumName = document.createElement('p');
        slickAlbumName.textContent = res[i].slice(0, res[i].length - 4);

        slickContent.appendChild(slickImg);
        slickContent.appendChild(slickAlbumName);
        slickList.appendChild(slickContent);
        slickRoot.appendChild(slickList);
      }

      main_initSlick();
    }
  });
}

function main_initSlick() {
  $('.album-slick').slick({
    slidesToShow: 5,
    slidesToScroll: 2,
    // Infinity: true,
    // centerMode: true,
    // centerPadding: '60px',
    arrows: true, // 좌우 화살표 표시 여부
    autoplay: true,
    autoplaySpeed: 3000, // 자동 스크롤 시 다음으로 넘어가는데 걸리는 시간 (ms)
    pauseOnHover: true, // 슬라이드 이동 시 마우스 호버하면 슬라이더 멈추게 설정
    prevArrow: `<button type='button' class='slick-prev'><image src='../images/icons/caret-left-solid.svg' /></button>`, // 이전 화살표 설정
    nextArrow: `<button type='button' class='slick-next'><image src='../images/icons/caret-right-solid.svg' /></button>`, // 다음 화살표 설정
    // 반응형 옵션
    responsive: [
      {
        breakpoint: 480, //화면 사이즈
        settings: {
          //위에 옵션이 디폴트 , 여기에 추가하면 그걸로 변경
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  });

  // 서버에 파일을 요청해서 받는다.
  getFile('./public/json', 'albumYoutubes.json').then(function (res) {
    if (res) mainObj.album.jsonData = res.data;
  });

  $('.album-slick').click(function (e) {
    if (e.target.parentElement.classList == 'slick-content') {
      const albumName = e.target.parentElement.lastChild.textContent;
      console.log(albumName);
      let youtubeUrl = 'https://www.youtube.com/embed/0-q1KafFCLU';
      const $modal = $('#album-video-contanier');
      const $content = $('#album-video');
      let findIndex = -1;

      for (let i = 0; i < mainObj.album.jsonData.length; i++) {
        if (mainObj.album.jsonData[i].name == albumName) {
          findIndex = i;
          break;
        }
      }

      if (findIndex != -1) {
        youtubeUrl = mainObj.album.jsonData[findIndex].url;
        $modal.css('display', 'block');
        $content.html(
          `<iframe src="${youtubeUrl}" width="640" height="360" class="note-video-clip"></iframe>`,
        );
      }
    }
  });
  $('#album-video-contanier').click(function (e) {
    if (e.target == this) {
      e.target.style.display = 'none';
      $('#album-video').html('');
    }
  });
}

function main_videoChange(e) {
  const nextIdx = mainObj.video.currentIdx + 1;
  const setIdx = nextIdx >= mainObj.video.sources.length ? 0 : nextIdx;
  mainObj.video.currentIdx = setIdx;
  mainObj.video.element.src = mainObj.video.sources[setIdx];
  mainObj.video.element.load();
}
function main_bgRandomSet() {
  const max = 3;
  const rand = getRandomInt(1, max);
  document.getElementById(
    'section-stock',
  ).style.backgroundImage = `url('../images/bg/bg_iu_${rand}.jpg')`;
  document.getElementById(
    'section-message',
  ).style.backgroundImage = `url('../images/bg/bg_iu_${rand}.jpg')`;
}

// 주가 스크래핑 데이터 설정
function main_initStock() {
  // 오늘 날짜 설정
  setTimeout(() => {
    const today = getToday() + ' 기준';
    document.getElementById('stock-today').innerText = today;
  }, 10);

  // 데이터 비동기처리의 완료를 찾기위해 max값을 설정
  mainObj.stock.datasMax = 4;

  // node에 스크래핑을 요청해서 주가 데이터를 받아온다.
  getScraping(
    'https://finance.naver.com/item/sise.nhn?code=035900',
    'stock',
  ).then(function (res) {
    mainObj.stock.datas.push(res);
  });

  getScraping(
    'https://finance.naver.com/item/sise.nhn?code=352820',
    'stock',
  ).then(function (res) {
    mainObj.stock.datas.push(res);
  });

  getScraping(
    'https://finance.naver.com/item/sise.nhn?code=122870',
    'stock',
  ).then(function (res) {
    mainObj.stock.datas.push(res);
  });

  getScraping(
    'https://finance.naver.com/item/sise.nhn?code=041510',
    'stock',
  ).then(function (res) {
    mainObj.stock.datas.push(res);
  });

  // 위의 비동기 처리가 모두 완료된 것을 확인하고 동작을 수행하는 루틴
  mainObj.stock.interval = setInterval(() => {
    if (mainObj.stock.datas.length == mainObj.stock.datasMax) {
      clearInterval(mainObj.stock.interval);
      mainObj.stock.interval = null;
      main_stockRolling();
    }
  }, 200);
}

function main_stockRolling() {
  const rollingList = document.getElementsByClassName('rolling-list')[0];

  const timer = 2000; // 롤링 주기(ms)
  const transitionTime = '0.5s'; // 롤링 애니메이션 시간
  const endAnimTimer = 1000; // css의 transition이 끝난 뒤에 실행할 setTimeout 함수를 위한 시간 설정 값

  // .rolling-list의 자식 ul관련 데이터
  const childIndex = {
    max: 2,
    current: 0,
    next: 1,
  };

  let dataCurrentIdx = 0; // 주가 데이터 인덱스

  // 처음 데이터 설정
  main_stockRollingTextSet(rollingList, 0, mainObj.stock.datas, dataCurrentIdx);
  main_stockRollingTextSet(
    rollingList,
    1,
    mainObj.stock.datas,
    ++dataCurrentIdx,
  );

  rollingList.childNodes[childIndex.next].style.transition = '0s';
  rollingList.childNodes[childIndex.next].style.transform = 'translateY(100%)';

  // 반복 루틴 실행
  setInterval(() => {
    rollingList.childNodes[childIndex.current].style.transition =
      transitionTime;
    rollingList.childNodes[childIndex.current].style.transform =
      'translateY(-100%)';
    rollingList.childNodes[childIndex.next].style.transition = transitionTime;
    rollingList.childNodes[childIndex.next].style.transform = 'translateY(0)';

    setTimeout(() => {
      rollingList.childNodes[childIndex.current].style.transition = '0s';
      rollingList.childNodes[childIndex.current].style.transform =
        'translateY(100%)';

      if (++dataCurrentIdx >= mainObj.stock.datas.length) dataCurrentIdx = 0;
      main_stockRollingTextSet(
        rollingList,
        childIndex.current,
        mainObj.stock.datas,
        dataCurrentIdx,
      );

      if (++childIndex.current >= childIndex.max) childIndex.current = 0;
      if (++childIndex.next >= childIndex.max) childIndex.next = 0;
    }, endAnimTimer);
  }, timer);
}

// 주가 텍스트 설정
function main_stockRollingTextSet(parentEle, childIdx, datas, datasIdx) {
  parentEle.childNodes[childIdx].childNodes[0].textContent =
    datas[datasIdx].name;
  parentEle.childNodes[childIdx].childNodes[1].textContent =
    datas[datasIdx].nowVal;

  if (datas[datasIdx].rate.includes('-')) {
    parentEle.childNodes[
      childIdx
    ].childNodes[2].innerHTML = `<i class="far fa-caret-square-down" style="color:blue"></i>`;
    parentEle.childNodes[childIdx].childNodes[2].style.color = 'blue';
    parentEle.childNodes[childIdx].childNodes[3].style.color = 'blue';
  } else {
    if (datas[datasIdx].rate.includes('+')) {
      parentEle.childNodes[
        childIdx
      ].childNodes[2].innerHTML = `<i class="far fa-caret-square-up" style="color:red"></i>`;
      parentEle.childNodes[childIdx].childNodes[2].style.color = 'red';
      parentEle.childNodes[childIdx].childNodes[3].style.color = 'red';
    } else {
      parentEle.childNodes[childIdx].childNodes[2].innerHTML = '';
      parentEle.childNodes[childIdx].childNodes[2].style.color = 'black';
      parentEle.childNodes[childIdx].childNodes[3].style.color = 'black';
    }
  }

  parentEle.childNodes[childIdx].childNodes[2].innerHTML +=
    datas[datasIdx].diffVal;
  parentEle.childNodes[childIdx].childNodes[3].textContent =
    datas[datasIdx].rate;
}