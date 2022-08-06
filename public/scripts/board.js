const boardObj = {
  state: '',
  boardResponseData: {
    id: undefined,
    author: undefined,
    text: undefined,
    title: undefined,
  },
  summerNoteElements: {
    $root: null,
    $text: null, // edit main text
    $editor: null,
  },
  textElements: {
    $titleInput: null,
    $titleSpan: null,
    $mainText: null, // read only
    $author: null,
    $create_at: null,
  },
  btnElements: {
    $write: HTMLButtonElement,
    $edit: HTMLButtonElement,
    $delete: HTMLButtonElement,
    $modify: HTMLButtonElement,
    $cancel: HTMLButtonElement,
  },
  image: {
    files: [],
    elements: [],
  },
};

const boardState = {
  write: 'write',
  read: 'read',
  readAuthor: 'readAuthor', // 글쓴이가 읽는 경우
  editable: 'editable', // 글 수정 가능 상태
};

window.addEventListener('load', e => {
  board_initObj();
  board_initEventListener();
  board_initState();
});

function board_initObj() {
  boardObj.textElements.$titleSpan = $('span.title-text');
  boardObj.textElements.$titleInput = $('input.title-text');
  boardObj.textElements.$mainText = $('#text');
  boardObj.textElements.$author = $('#author');
  boardObj.textElements.$create_at = $('#create_at');
  boardObj.btnElements.$write = document.getElementById('write');
  boardObj.btnElements.$edit = document.getElementById('edit');
  boardObj.btnElements.$delete = document.getElementById('delete');
  boardObj.btnElements.$modify = document.getElementById('modify');
  boardObj.btnElements.$cancel = document.getElementById('cancel');
}

function board_initEventListener() {
  boardObj.btnElements.$write.addEventListener('click', board_onClickWriteBtn);
  boardObj.btnElements.$edit.addEventListener('click', board_onClickEditBtn);
  boardObj.btnElements.$delete.addEventListener(
    'click',
    board_onClickDeleteBtn,
  );
  boardObj.btnElements.$modify.addEventListener(
    'click',
    board_onClickModifyBtn,
  );
  boardObj.btnElements.$cancel.addEventListener(
    'click',
    board_onClickCancelBtn,
  );
}

async function board_initState() {
  const boardStateElement = $('#boardState');
  boardObj.state = boardStateElement.text();

  if (boardObj.state === boardState.write) board_initSummerNote();
  else if (boardObj.state === boardState.read) {
    // 글 읽기의 경우 기존 데이터를 서버에 요청한다.
    try {
      boardObj.boardResponseData = await $.ajax({
        url: '/board',
        method: 'search',
        dataType: 'json',
      });

      boardObj.textElements.$author.text(boardObj.boardResponseData.author);
      boardObj.textElements.$create_at.text(
        boardObj.boardResponseData.created_at,
      );
      boardObj.textElements.$titleInput.val(boardObj.boardResponseData.title);
      boardObj.textElements.$titleSpan.text(boardObj.boardResponseData.title);
      boardObj.textElements.$mainText.html(boardObj.boardResponseData.text);

      // 로그인 되어있는 유저와 현재 선택한 게시글이 같은 경우 상태 변경
      const userResponse = await fetch('/users/single', {
        method: 'get',
      });

      if (userResponse.status === 200) {
        const user = await userResponse.json();
        if (user.user_uniqueName === boardObj.boardResponseData.author) {
          boardObj.state = boardState.readAuthor;
        }
      }
    } catch (error) {
      console.error('board search data request error', error);
    }
  }

  board_stateAction();
}

function board_initSummerNote() {
  if (boardObj.summerNoteElements.$root) return;

  boardObj.summerNoteElements.$root = $('#summer-note').summernote({
    lang: 'ko-KR',
    height: '37vh',
    // placeholder: '최대 2048자까지 입력이 가능합니다',
    toolbar: [
      ['Font Style', ['fontname']],
      ['style', ['bold', 'italic', 'underline']],
      ['font', ['strikethrough']],
      ['fontsize', ['fontsize']],
      ['color', ['forecolor', 'backcolor']],
      ['para', ['ul', 'ol', 'paragraph']],
      ['height', ['height']],
      ['insert', ['picture', 'link', 'video']],
      ['help', ['help']],
    ],
    fontNames: [
      'Arial',
      'Arial Black',
      'Comic Sans MS',
      'Courier New',
      '맑은 고딕',
      '궁서',
      '굴림체',
      '굴림',
      '돋움체',
      '바탕체',
    ],
    fontSizes: [
      '8',
      '9',
      '10',
      '11',
      '12',
      '14',
      '16',
      '18',
      '20',
      '22',
      '24',
      '28',
      '30',
      '36',
      '50',
      '72',
    ],

    callbacks: {
      onImageUpload: async function (files, editor, welEditable) {
        if (files?.length) {
          for (file of files) {
            const response = await createThumbnailImageFile(file, this);
            console.log(response);
          }
        }
      },
      onPaste: function (e) {
        var clipboardData = e.originalEvent.clipboardData;
        if (
          clipboardData &&
          clipboardData.items &&
          clipboardData.items.length
        ) {
          var item = clipboardData.items[0];
          if (item.kind === 'file' && item.type.includes('image') == true) {
            e.preventDefault();
          }
        }
      },
      // 사진 클릭 후 나타나는 UI에서 삭제 버튼(휴지통 모양)을 누르면 호출되는 함수
      onMediaDelete: function (target) {
        // 배열에 저장해둔 이미지들의 엘리먼트와 동일한 타겟이 있으면 배열에서 제거해준다.
        for (let i = 0; i < boardObj.image.elements.length; i++) {
          const findIdx = boardObj.image.elements.indexOf(target[0]);
          if (findIdx != -1) {
            boardObj.image.elements.splice(findIdx, 1);
            boardObj.image.files.splice(findIdx, 1);
          }
        }
      },
    },
  });

  boardObj.summerNoteElements.$text = $('.note-editable');
  boardObj.summerNoteElements.$editor = $('.note-editor');
}

// 썸머노트 사진추가시 에디터에 보여줄 이미지 파일을 생성한다.
function createThumbnailImageFile(file, editor) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // 파일 로드가 끝나면 호출될 이벤트 함수
    reader.onload = async e => {
      try {
        const src = window.URL.createObjectURL(
          base64StringToBlob(e.target.result),
        );

        $(editor)
          .summernote('insertImage', src, file.name)
          .then(() => {
            resolve(file.name);
          });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

function board_stateAction() {
  boardObj.btnElements.$write.hidden = true;
  boardObj.btnElements.$edit.hidden = true;
  boardObj.btnElements.$delete.hidden = true;
  boardObj.btnElements.$modify.hidden = true;
  boardObj.btnElements.$cancel.hidden = true;

  boardObj.textElements.$titleInput.hide();
  boardObj.textElements.$titleSpan.hide();
  boardObj.textElements.$mainText.hide();
  boardObj.summerNoteElements.$editor?.hide();

  switch (boardObj.state) {
    case boardState.write:
      boardObj.btnElements.$write.hidden = false;
      boardObj.textElements.$titleInput.show();
      boardObj.summerNoteElements.$editor?.show();
      break;
    case boardState.read:
      boardObj.textElements.$titleSpan.show();
      boardObj.textElements.$mainText.show();
      break;
    case boardState.readAuthor:
      boardObj.btnElements.$edit.hidden = false;
      boardObj.btnElements.$delete.hidden = false;
      boardObj.textElements.$titleSpan.show();
      boardObj.textElements.$mainText.show();
      break;
    case boardState.editable:
      boardObj.btnElements.$modify.hidden = false;
      boardObj.btnElements.$cancel.hidden = false;
      boardObj.textElements.$titleInput.show();
      boardObj.summerNoteElements.$editor?.show();
      break;
  }
}

function board_sendImageFile(file, selector) {
  return new Promise((resolve, reject) => {
    // 이미지 형식 확인
    if (!file.type.includes('image')) {
      Swal.fire({
        icon: 'warning',
        text: '파일 형식이 이미지가 아닙니다',
      });
      reject();
    }

    // 이미지 크기 확인
    const limitImageSize = 5 * 1024 * 1024;
    if (file.size >= limitImageSize) {
      Swal.fire({
        icon: 'warning',
        title: '파일 용량 초과',
        text: '이미지당 5MB미만으로 업로드가 가능합니다',
      });
      reject();
    }

    const formData = new FormData();
    formData.append('img', file);

    $.ajax({
      url: '/files/file/image',
      type: 'POST',
      cache: false,
      contentType: false,
      enctype: 'multipart/form-data',
      processData: false,
      data: formData,
      async: false, // 비동기 옵션 OFF (동기적 처리)
      success: function (res) {
        /* public폴더가 static으로 설정되어 있으니까
        경로에서 public을 제외한 나머지 경로를 받아온다. */
        const resFilePath = res.path.replace('public', '');
        // 이미지 태그의 소스 경로를 업데이트 한 파일로 수정한다.
        selector.src = resFilePath;
        console.log(resFilePath);
        resolve();
      },
      error: function (err) {
        console.error('send image file error', err);
        reject();
      },
    });
  });
}

function board_submitChecker() {
  if (isEmptyString(boardObj.textElements.$titleInput.val())) {
    Swal.fire({
      icon: 'error',
      text: '제목을 입력해주세요!',
    });
    return false;
  }

  if (boardObj.summerNoteElements.$root.summernote('isEmpty')) {
    Swal.fire({
      icon: 'error',
      text: '본문을 입력해주세요!',
    });
    return false;
  }

  return true;
}

async function board_imageUpload() {
  // todo: 이미지 업로드시 파일이 여러개일 경우 한번에 요청 하는 기능
  // todo: 이미지 업로드 비동기 요청 처리
  // todo: 중복된 이미지 파일에 대한 처리(파일은 하나만 업로드 하되, img src에 하나의 파일만 중복으로 적용 될 수 있도록 처리)

  // 서버에 이미지 업로드 요청
  boardObj.image.elements = [
    ...document.querySelectorAll('div.note-editable img'),
  ];

  for (let i = 0; i < boardObj.image.elements.length; i++) {
    try {
      // 동기적으로 서버에 이미지파일 업로드 요청, ImagePath를 받아온다.
      // await board_sendImageFile(
      //   boardObj.image.files[findIdx],
      //   imageSelectors[i],
      // );
    } catch (error) {
      console.error('board image upload error', error);
      return false;
    }
  }
  console.log('board_imageUpload complete');
  return true;
}

function getImageFileNameList(imageElements) {
  const length = imageElements?.length;
  if (!length || !(imageElements[0] instanceof HTMLImageElement)) return '';

  const imageFileNameList = [];
  let source = '';
  let fileName = '';
  for (let i = 0; i < length; ++i) {
    source = imageElements[i].src;
    fileName = source.substring(source.lastIndexOf('/') + 1, source.length);
    imageFileNameList.push(fileName);
  }

  return imageFileNameList;
}

async function board_onClickWriteBtn(e) {
  e.preventDefault();

  if (!board_submitChecker()) return; // 제목, 본문 빈 문자열 체크
  if (!(await board_imageUpload())) return; // 이미지 업로드

  // 이미지 업로드 후 바뀐 태그가 발생하므로 텍스트를 다시 받아준다.
  const reqBody = {
    author: boardObj.textElements.$author.text(),
    title: boardObj.textElements.$titleInput.val(),
    text: boardObj.summerNoteElements.$text.html(),
    imageFileNameList:
      getImageFileNameList(boardObj.image.elements)?.toString() ?? '',
  };

  setTimeout(() => {
    fetch('/board', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody),
    })
      .then(function (res) {
        if (res.status == 200) {
          Swal.fire({
            icon: 'success',
            text: '글쓰기 완료!',
          }).then(function () {
            window.location.href = '/community';
          });
        }
      })
      .catch(function (error) {
        console.error('write board failed', error);
      });
  }, 500);
}

// 편집 가능 상태로 전환
function board_onClickEditBtn() {
  board_initSummerNote();
  boardObj.textElements.$titleInput.val(
    boardObj.textElements.$titleSpan.text(),
  );
  boardObj.summerNoteElements.$text.html(boardObj.boardResponseData.text);
  boardObj.state = boardState.editable;
  board_stateAction();
}

async function board_onClickModifyBtn(e) {
  // todo: 게시글 수정시 이미지 파일 확인해서 필요없는 파일 삭제 기능 필요
  e.preventDefault();

  if (!board_submitChecker()) return;
  if (!(await board_imageUpload())) return;

  const reqBody = {
    author: boardObj.textElements.$author.text(),
    title: boardObj.textElements.$titleInput.val(),
    text: boardObj.summerNoteElements.$text.html(),
    imageFileNameList:
      getImageFileNameList(boardObj.image.elements)?.toString() ?? '',
  };

  setTimeout(() => {
    $.ajax({
      url: '/board',
      method: 'patch',
      dataType: 'json',
      data: reqBody,
      success: function (res) {
        if (res.result == 'success') {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: '게시글이 수정되었습니다.',
            showConfirmButton: false,
            timer: 1000,
          });
          selectBoard_onClickCancelBtn();
        }
      },
      error: error => {
        console.error('modify failed', error);
      },
    });
  }, 500);
}

function board_onClickDeleteBtn(e) {
  e.preventDefault();

  $.ajax({
    url: '/board',
    method: 'delete',
    dataType: 'json',
    data: { id: boardObj.boardResponseData.id },
    success: function (res) {
      if (res.result == 'success') {
        Swal.fire({
          icon: 'success',
          text: '작성글이 삭제되었습니다.',
        }).then(function () {
          window.location.replace('/community');
        });
      }
    },
  });
}

function board_onClickCancelBtn(e) {
  e.preventDefault();
  boardObj.state = boardState.readAuthor;
  board_stateAction();
}

// base64를 Blob포맷으로 컨버팅해주는 함수
function base64StringToBlob(base64) {
  var type = base64.match(/data:([^;]+)/)[1];
  base64 = base64.replace(/^[^,]+,/g, '');
  var options = {};
  if (type) {
    options.type = type;
  }
  var binaryArrayBuffer = [binaryStringToArrayBuffer(window.atob(base64))];
  return new Blob(binaryArrayBuffer, options);
}

function binaryStringToArrayBuffer(binary) {
  var length = binary.length;
  var buf = new ArrayBuffer(length);
  var arr = new Uint8Array(buf);
  for (var i = 0; i < length; i++) {
    arr[i] = binary.charCodeAt(i);
  }
  return buf;
}

/* base64 포맷의 url을 file데이터로 변환시켜주는 함수
  Usage example:
  var file = dataURLtoFile('data:text/plain;base64,aGVsbG8gd29ybGQ=', 'hello.txt'); */
const dataURLtoFile = (dataurl, fileName) => {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = window.atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], fileName, { type: mime });
};
