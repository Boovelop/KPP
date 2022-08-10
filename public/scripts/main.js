const main = {
  video: {
    element: null,
    currentIdx: 0,
    sources: [
      './videos/iu_celebrity.webm',
      './videos/bts_dynamite.webm',
      './videos/twice_TT.webm',
      './videos/볼빨간사춘기_우주를줄게.webm',
    ],
  },
  stock: {
    dataArray: [],
    dataArrayMax: 0,
    interval: null,
  },
  album: {
    jsonData: null,
  },

  initBindElements() {
    this.video.element = document.querySelector('#section-video>video');
  },

  initState() {
    // 현재 페이지의 상단 로고 설정
    document.getElementById('header-logo').style.position = 'absolute';

    const randVal = utils.getRandomInt(0, this.video.sources.length - 1);
    this.playVideo(randVal);
  },

  initEventListener() {
    this.video.element.addEventListener('ended', this.onChangeVideo);
  },

  async initAlbum() {
    const response = await serverUtils.getFiles('./public/images/albums');
    if (response?.length < 1) return;

    // 태그 생성 및 리소스 설정
    const slickRoot = document.querySelector('.album-slick');
    let slickList, slickContent, slickImg, slickAlbumName;
    for (let i = 0; i < response.length; i++) {
      slickList = document.createElement('div');
      slickContent = document.createElement('div');
      slickContent.classList.add('slick-content');

      slickImg = document.createElement('img');
      slickImg.src = `./images/albums/${response[i]}`;

      slickAlbumName = document.createElement('p');
      slickAlbumName.textContent = response[i].slice(0, response[i].length - 4);

      slickContent.appendChild(slickImg);
      slickContent.appendChild(slickAlbumName);
      slickList.appendChild(slickContent);
      slickRoot.appendChild(slickList);
    }

    this.initSlick();
  },

  initSlick() {
    $('.album-slick').slick({
      slidesToShow: 5,
      slidesToScroll: 2,
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
    serverUtils
      .getFile('./public/json', 'albumYoutubes.json')
      .then(function (res) {
        if (res) main.album.jsonData = res.data;
      });

    $('.album-slick').on('click', function (e) {
      if (e.target.parentElement.classList == 'slick-content') {
        const albumName = e.target.parentElement.lastChild.textContent;
        let youtubeUrl = 'https://www.youtube.com/embed/0-q1KafFCLU';
        const $modal = $('#album-video-contanier');
        const $content = $('#album-video');
        let findIndex = -1;

        for (let i = 0; i < this.album.jsonData.length; i++) {
          if (this.album.jsonData[i].name == albumName) {
            findIndex = i;
            break;
          }
        }

        if (findIndex != -1) {
          youtubeUrl = this.album.jsonData[findIndex].url;
          $modal.css('display', 'block');
          $content.html(
            `<iframe src="${youtubeUrl}" width="640" height="360" class="note-video-clip"></iframe>`,
          );
        }
      }
    });

    $('#album-video-contanier').on('click', function (e) {
      if (e.target == this) {
        e.target.style.display = 'none';
        $('#album-video').html('');
      }
    });
  },

  initBackground() {
    const max = 3;
    const rand = utils.getRandomInt(1, max);
    document.getElementById(
      'section-stock',
    ).style.backgroundImage = `url('../images/bg/bg_iu_${rand}.jpg')`;
    document.getElementById(
      'section-message',
    ).style.backgroundImage = `url('../images/bg/bg_iu_${rand}.jpg')`;
  },

  // 주가 스크래핑 데이터 설정
  async initStock() {
    // 오늘 날짜 설정
    setTimeout(() => {
      const today = utils.getToday() + ' 기준';
      document.getElementById('stock-today').innerText = today;
    }, 10);

    // node에 스크래핑을 요청해서 주가 데이터를 받아온다.
    this.stock.dataArray.push(
      await serverUtils.getScraping(
        'https://finance.naver.com/item/sise.nhn?code=035900',
        'stock',
      ),
      await serverUtils.getScraping(
        'https://finance.naver.com/item/sise.nhn?code=352820',
        'stock',
      ),
      await serverUtils.getScraping(
        'https://finance.naver.com/item/sise.nhn?code=122870',
        'stock',
      ),
      await serverUtils.getScraping(
        'https://finance.naver.com/item/sise.nhn?code=041510',
        'stock',
      ),
    );
    this.initStockRolling();
  },

  initStockRolling() {
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
    this.stockRollingTextSet(
      rollingList,
      0,
      this.stock.dataArray,
      dataCurrentIdx,
    );

    this.stockRollingTextSet(
      rollingList,
      1,
      this.stock.dataArray,
      ++dataCurrentIdx,
    );

    rollingList.childNodes[childIndex.next].style.transition = '0s';
    rollingList.childNodes[childIndex.next].style.transform =
      'translateY(100%)';

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

        if (++dataCurrentIdx >= this.stock.dataArray.length) dataCurrentIdx = 0;

        this.stockRollingTextSet(
          rollingList,
          childIndex.current,
          this.stock.dataArray,
          dataCurrentIdx,
        );

        if (++childIndex.current >= childIndex.max) childIndex.current = 0;
        if (++childIndex.next >= childIndex.max) childIndex.next = 0;
      }, endAnimTimer);
    }, timer);
  },

  // 주가 텍스트 설정
  stockRollingTextSet(parentEle, childIdx, datas, datasIdx) {
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
  },

  playVideo(idx) {
    this.video.currentIdx = idx;
    this.video.element.src = this.video.sources[idx];
    this.video.element.load();
  },

  // ------------------- EventListener -------------------
  onChangeVideo() {
    const nextIdx = this.video.currentIdx + 1;
    const setIdx = nextIdx >= this.video.sources.length ? 0 : nextIdx;
    this.playVideo(setIdx);
  },
};

window.addEventListener('load', function () {
  history.scrollRestoration = 'manual';

  main.initBindElements();
  main.initState();
  main.initEventListener();
  main.initAlbum();
  main.initBackground();
  main.initStock();
});
