// fetch함수로 데이터 요청 및 응답 데이터를 받아오는 함수
async function fetchGetResponse(url, headersOption) {
  let response = await fetch(url, {
    method: 'get',
    headers: headersOption,
  });

  if (response.ok) {
    let data = null;
    if (headersOption['Content-Type'] == 'application/json')
      data = await response.json();
    else data = response;

    return data;
  }
  return null;
}

// 로그인 체크 관련 함수
async function loginCheck() {
  let response = await fetchGetResponse('/auth/loginCheck', {
    'Content-Type': 'application/json',
  });
  return response;
}

// 스크랩 함수
async function getScraping(url, type) {
  if (type == null) {
    console.error('Type error');
    return null;
  }
  const fullURL = '/files/scraping/?url=' + url + '&type=' + type;
  let response = await fetchGetResponse(fullURL, {
    'Content-Type': 'application/json',
  });
  return response;
}

// 폴더 내부의 파일들을 받아오는 함수 (기본 경로는 app.js기준이다)
async function getFiles(dir) {
  const fullDir = `/files/dir?dir=${dir}`;
  let response = await fetchGetResponse(fullDir, {
    'Content-Type': 'application/json',
  });
  return response;
}

// 단일 파일을 받아오는 함수
async function getFile(dir, fileName) {
  const fullDir = `/files/file?dir=${dir}&fileName=${fileName}`;
  let response = await fetchGetResponse(fullDir, {
    'Content-Type': 'application/json',
  });
  return response;
}

// 게시판 데이터 받아오는 함수
async function getBoards() {
  let response = await fetchGetResponse('/board', {
    'Content-Type': 'application/json',
  });
  return response;
}

// 현재 날짜와 시간을 [YY-MM-DD hh:mm:ss] 형태로 리턴하는 함수
function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = ('0' + (1 + date.getMonth())).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
  );
}

// 최소와 최대값의 랜덤값을 보내준다 (소수 포함)
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
// 정수형의 랜덤 값
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// DB의 created_at 데이터를 YYYY-MMMM-DD HH:MM:SS 포맷형태로 바꿔서 리턴
function getCreatedAtFormat(createAt) {
  const createDay = createAt.split('T');
  createDay[1] = createDay[1].slice(0, createDay[1].length - 5);
  return createDay[0] + ' ' + createDay[1];
}

// Element의 스타일을 바꾸는 편의성을 제공하는 함수
function setElementStyle(element, style, option) {
  switch (style) {
    case 'color':
      element.style.color = option;
      break;
    case 'border':
      element.style.border = option;
      break;
  }
}

function isEmptyString(str) {
  if (str === '' || !str?.length) {
    return true;
  }
  return false;
}
