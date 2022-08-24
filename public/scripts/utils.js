const utils = {
  // 현재 날짜와 시간을 [YY-MM-DD hh:mm:ss] 형태로 리턴하는 함수
  getToday() {
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
  },

  // 최소와 최대값의 랜덤값을 보내준다 (소수 포함)
  getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  },

  // 정수형의 랜덤 값
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // DB의 created_at 데이터를 YYYY-MMMM-DD HH:MM:SS 포맷형태로 바꿔서 리턴
  getCreatedAtFormat(createAt) {
    const createDay = createAt.split('T');
    createDay[1] = createDay[1].slice(0, createDay[1].length - 5);
    return createDay[0] + ' ' + createDay[1];
  },

  // Element의 스타일을 바꾸는 편의성을 제공하는 함수
  setElementStyle(element, style, option) {
    switch (style) {
      case 'color':
        element.style.color = option;
        break;
      case 'border':
        element.style.border = option;
        break;
    }
  },

  isEmptyString(str) {
    if (str === '' || !str?.length) {
      return true;
    }
    return false;
  },

  base64StringToBlob(base64) {
    var type = base64.match(/data:([^;]+)/)[1];
    base64 = base64.replace(/^[^,]+,/g, '');
    var options = {};
    if (type) {
      options.type = type;
    }
    var binaryArrayBuffer = [binaryStringToArrayBuffer(window.atob(base64))];
    return new Blob(binaryArrayBuffer, options);
  },

  binaryStringToArrayBuffer(binary) {
    var length = binary.length;
    var buf = new ArrayBuffer(length);
    var arr = new Uint8Array(buf);
    for (var i = 0; i < length; i++) {
      arr[i] = binary.charCodeAt(i);
    }
    return buf;
  },

  // (base64 or blob) to file
  async urlToFile(url, fileName, mimeType) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return new File([buffer], fileName, mimeType);
  },

  /* base64 to file
  Usage example: const file = dataURLtoFile('data:text/plain;base64,aGVsbG8gd29ybGQ=', 'hello.txt'); */
  dataURLtoFile(dataURL, fileName) {
    let arr = dataURL.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = window.atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], fileName, { type: mime });
  },

  isBase64(dataURL) {
    const arr = dataURL.split(',');
    if (!arr || !arr[0]) return false;
    if (arr[0].search('base64') != -1) return true;
  },
};
