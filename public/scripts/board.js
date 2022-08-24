const board = {
  state: '',
  isHTTPRequesting: false,
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
    write: null,
    edit: null,
    delete: null,
    modify: null,
    cancel: null,
  },
  image: {
    elements: [],
  },
  initObj() {
    this.textElements.$titleSpan = $('span.title-text');
    this.textElements.$titleInput = $('input.title-text');
    this.textElements.$mainText = $('#text');
    this.textElements.$author = $('#author');
    this.textElements.$create_at = $('#create_at');
    this.btnElements.write = document.getElementById('write');
    this.btnElements.edit = document.getElementById('edit');
    this.btnElements.delete = document.getElementById('delete');
    this.btnElements.modify = document.getElementById('modify');
    this.btnElements.cancel = document.getElementById('cancel');
  },
  initEventListener() {
    this.btnElements.write.addEventListener('click', board.onClickWriteBtn);
    this.btnElements.edit.addEventListener('click', board.onClickEditBtn);
    this.btnElements.delete.addEventListener('click', board.onClickDeleteBtn);
    this.btnElements.modify.addEventListener('click', board.onClickModifyBtn);
    this.btnElements.cancel.addEventListener('click', board.onClickCancelBtn);
  },
  async initState() {
    const boardStateElement = $('#boardState');
    board.state = boardStateElement.text();

    if (board.state === boardState.write) board.initSummerNote();
    else if (board.state === boardState.read) {
      try {
        // 글 읽기의 경우 기존 데이터를 서버에 요청한다.
        await board.requestBoardData();
        // 로그인 되어있는 유저와 현재 선택한 게시글이 같은 경우 상태 변경
        const userResponse = await fetch('/users/single', {
          method: 'get',
        });

        if (userResponse.status === 200) {
          const user = await userResponse.json();
          if (user.user_uniqueName === board.boardResponseData.author) {
            board.state = boardState.readAuthor;
          }
        }
      } catch (error) {
        console.error('board search data request error', error);
      }
    }
    this.stateAction();
  },
  initSummerNote() {
    if (this.summerNoteElements.$root) return;
    this.summerNoteElements.$root = $('#summer-note').summernote({
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
    });

    this.summerNoteElements.$text = $('.note-editable');
    this.summerNoteElements.$editor = $('.note-editor');
  },
  stateAction() {
    board.btnElements.write.hidden = true;
    board.btnElements.edit.hidden = true;
    board.btnElements.delete.hidden = true;
    board.btnElements.modify.hidden = true;
    board.btnElements.cancel.hidden = true;

    board.textElements.$titleInput.hide();
    board.textElements.$titleSpan.hide();
    board.textElements.$mainText.hide();
    board.summerNoteElements.$editor?.hide();

    switch (board.state) {
      case boardState.write:
        board.btnElements.write.hidden = false;
        board.textElements.$titleInput.show();
        board.summerNoteElements.$editor?.show();
        break;
      case boardState.read:
        board.textElements.$titleSpan.show();
        board.textElements.$mainText.show();
        break;
      case boardState.readAuthor:
        board.btnElements.edit.hidden = false;
        board.btnElements.delete.hidden = false;
        board.textElements.$titleSpan.show();
        board.textElements.$mainText.show();
        break;
      case boardState.editable:
        board.btnElements.modify.hidden = false;
        board.btnElements.cancel.hidden = false;
        board.textElements.$titleInput.show();
        board.summerNoteElements.$editor?.show();
        break;
    }
  },
  submitChecker() {
    if (utils.isEmptyString(board.textElements.$titleInput.val())) {
      Swal.fire({
        icon: 'error',
        text: '제목을 입력해주세요!',
      });
      return false;
    }

    if (board.summerNoteElements.$root.summernote('isEmpty')) {
      Swal.fire({
        icon: 'error',
        text: '본문을 입력해주세요!',
      });
      return false;
    }

    return true;
  },
  imageFileChecker(file) {
    // 이미지 형식 확인
    if (!file.type.includes('image')) {
      Swal.fire({
        icon: 'warning',
        text: '파일 형식이 이미지가 아닙니다',
      });
      return false;
    }

    // 이미지 크기 확인
    const limitImageSize = 5 * 1024 * 1024;
    if (file.size >= limitImageSize) {
      Swal.fire({
        icon: 'warning',
        title: '파일 용량 초과',
        text: '이미지당 5MB미만으로 업로드가 가능합니다',
      });
      return false;
    }

    return true;
  },
  sendImageFiles(files, selectors) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      for (const file of files) {
        formData.append('img', file);
      }

      $.ajax({
        url: 'files/images',
        type: 'POST',
        cache: false,
        contentType: false,
        enctype: 'multipart/form-data',
        processData: false,
        data: formData,
        success: response => {
          for (let i = 0; i < response.length; ++i) {
            const file = response[i];
            const selector = selectors[i];
            if (!selector) break;
            /* public폴더가 static으로 설정되어 있으니까
            경로에서 public을 제외한 나머지 경로를 받아온다. */
            const resFilePath = file.path.replace('public', '');
            // 이미지 태그의 소스 경로를 업데이트 한 파일로 수정한다.
            selector.src = resFilePath;
          }
          resolve(response);
        },
        error: error => {
          if (error.status === 401) {
            Swal.fire({
              icon: 'error',
              text: '글 작성 및 수정에 로그인이 필요합니다!',
            });
          } else {
            console.error('Send ImageFiles Error', error);
          }
          reject(error);
        },
      });
    });
  },
  async imageUpload() {
    board.image.elements = [
      ...document.querySelectorAll('div.note-editable img'),
    ];

    const Base64Selectors = [];
    const imageFiles = [];
    for (const imageElement of board.image.elements) {
      if (!utils.isBase64(imageElement.src)) continue;
      imageFiles.push(
        utils.dataURLtoFile(
          imageElement.src,
          imageElement.dataset.filename,
          'image/*',
        ),
      );
      Base64Selectors.push(imageElement);
    }

    try {
      await board.sendImageFiles(imageFiles, Base64Selectors);
      return true;
    } catch (error) {
      console.error('SendImageFiles Fail');
      return false;
    }
  },
  getImageFileNameList(imageElements) {
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
  },

  async boardUpload() {
    if (!board.submitChecker()) return false;
    if (!(await board.imageUpload())) return false;

    const reqBody = {
      author: board.textElements.$author.text(),
      title: board.textElements.$titleInput.val(),
      text: board.summerNoteElements.$text.html(),
      imageFileNameList:
        board.getImageFileNameList(board.image.elements)?.toString() ?? '',
    };

    return reqBody;
  },

  async requestBoardData() {
    // 서버에 게시판 정보를 받아온다.
    board.boardResponseData = await $.ajax({
      url: '/board',
      method: 'search',
      dataType: 'json',
    });

    // 현재 게시판 요소들을 받아온 데이터로 업데이트한다.
    board.textElements.$author.text(board.boardResponseData.author);
    board.textElements.$create_at.text(board.boardResponseData.created_at);
    board.textElements.$titleInput.val(board.boardResponseData.title);
    board.textElements.$titleSpan.text(board.boardResponseData.title);
    board.textElements.$mainText.html(board.boardResponseData.text);
  },
  // ------------------- Eventlistener -------------------
  async onClickWriteBtn(e) {
    e.preventDefault();
    if (board.isHTTPRequesting) return false;
    board.isHTTPRequesting = true;

    const reqBody = await board.boardUpload();
    if (!reqBody) return;

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
              title: '글쓰기 완료!',
            }).then(function () {
              window.location.href = '/community';
            });
          }
        })
        .catch(function (error) {
          console.error('write board failed', error);
        })
        .finally(function (res) {
          board.isHTTPRequesting = false;
        });
    }, 500);
  },
  onClickEditBtn() {
    // 편집 가능 상태로 전환
    board.initSummerNote();
    board.textElements.$titleInput.val(board.textElements.$titleSpan.text());
    board.summerNoteElements.$text.html(board.boardResponseData.text);
    board.state = boardState.editable;
    board.stateAction();
  },
  async onClickModifyBtn(e) {
    // todo: 게시글 수정시 이미지 파일 확인해서 필요없는 파일 삭제 기능 필요
    e.preventDefault();
    if (board.isHTTPRequesting) return false;
    board.isHTTPRequesting = true;

    const reqBody = await board.boardUpload();
    if (!reqBody) return;

    reqBody.id = board.boardResponseData.id;

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
        complete: () => {
          board.isHTTPRequesting = false;
        },
      });
    }, 500);
  },
  async onClickDeleteBtn(e) {
    e.preventDefault();
    if (board.isHTTPRequesting) return;
    board.isHTTPRequesting = true;

    // 삭제 전 확인 및 취소 선택 사항
    const result = await Swal.fire({
      icon: 'warning',
      title: '정말 삭제하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '삭제합니다',
      cancelButtonText: '취소',
      cancelButtonColor: '#d33',
    });

    if (result.isConfirmed) {
      $.ajax({
        url: '/board',
        method: 'delete',
        dataType: 'json',
        data: { id: board.boardResponseData.id },
        success: function (res) {
          if (res.result == 'success') {
            Swal.fire({
              icon: 'success',
              title: '작성글이 삭제되었습니다.',
            }).then(function () {
              window.location.replace('/community');
            });
          }
        },
        complete: () => {
          board.isHTTPRequesting = false;
        },
      });
    }
  },
  onClickCancelBtn(e) {
    e.preventDefault();
    board.state = boardState.readAuthor;
    board.stateAction();
  },
};

const boardState = {
  write: 'write',
  read: 'read',
  readAuthor: 'readAuthor', // 글쓴이가 읽는 경우
  editable: 'editable', // 글 수정 가능 상태
};

window.addEventListener('load', e => {
  board.initObj();
  board.initEventListener();
  board.initState();
});
