const selectBoardObj = {
    data: null,
    summerNoteElements: {
        $root: null,
        $editor: null,
    },
    btnElements: {
        modify: HTMLButtonElement,
        delete: HTMLButtonElement,
        modifyOk: HTMLButtonElement,
        cancel: HTMLButtonElement,
    },
    titleElements: {
        $span: null,
        $input: null,
    },
    textElements: {
        $standard: null,
        $summerNote: null,
    },
};

window.addEventListener('load', function (e) {
    selectBoard_initObj();
    selectBoard_initEvent();
    selectBoard_initDataSet();
});

function selectBoard_initObj() {
    selectBoardObj.btnElements.modify = document.getElementById('modify');
    selectBoardObj.btnElements.delete = document.getElementById('delete');
    selectBoardObj.btnElements.modifyOk = document.getElementById('modify-ok');
    selectBoardObj.btnElements.cancel = document.getElementById('cancel');

    selectBoardObj.titleElements.$span = $('span.title-text');
    selectBoardObj.titleElements.$input = $('input.title-text');

    selectBoardObj.titleElements.$input.hide();

    selectBoardObj.textElements.$standard = $('#text');
}

function selectBoard_initEvent() {
    selectBoardObj.btnElements.modify.addEventListener('click', selectBoard_onClickModifyBtn);
    selectBoardObj.btnElements.delete.addEventListener('click', selectBoard_onClickDeleteBtn);
    selectBoardObj.btnElements.modifyOk.addEventListener('click', selectBoard_onClickModifyOkBtn);
    selectBoardObj.btnElements.cancel.addEventListener('click', selectBoard_onClickCancelBtn);
}

async function selectBoard_initDataSet() {
    selectBoard_setBtnShow();

    // 선택한 게시판의 데이터를 가져온다.
    const boardResponse = await $.ajax({
        url: '/board',
        method: 'search',
        dataType: 'json',
    });

    selectBoardObj.data = boardResponse;

    // 게시판 설정
    document.getElementById('author').innerText = boardResponse.author;
    document.getElementById('create_at').innerText = common_getCreatedAtFormat(boardResponse.created_at);

    selectBoard_setModifyMode(false);

    // 로그인 되어있는 유저와 현재 선택한 게시글이 같으면
    // 수정, 삭제 버튼이 보이게 설정
    const userResponse = await fetch('/users/single', {
        method: 'get',
    });

    let user;
    if (userResponse.status == 200) {
        user = await userResponse.json();
        if (user.user_uniqueName == boardResponse.author) {
            selectBoard_setBtnShow(true, true);
        }
    }
}
function selectBoard_initSummerNote() {
    selectBoardObj.summerNoteElements.$root = $('#summer-note').summernote({
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
        fontNames: ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', '맑은 고딕', '궁서', '굴림체', '굴림', '돋움체', '바탕체'],
        fontSizes: ['8', '9', '10', '11', '12', '14', '16', '18', '20', '22', '24', '28', '30', '36', '50', '72'],

        callbacks: {
            onImageUpload: function (files) {
                console.log(files);
                // uploadSummernoteImageFile(files[0],this);
            },
            // onPaste: function (e) {
            //     var clipboardData = e.originalEvent.clipboardData;
            //     if (clipboardData && clipboardData.items && clipboardData.items.length) {
            //         var item = clipboardData.items[0];
            //         if (item.kind === 'file' && item.type.indexOf('image/') !== -1) {
            //             e.preventDefault();
            //         }
            //     }
            // }
        },
    });

    selectBoardObj.summerNoteElements.$editor = $('.note-editor');
    selectBoardObj.textElements.$summerNote = $('.note-editable');
}

// 수정 버튼 클릭시
function selectBoard_onClickModifyBtn(e) {
    if (!selectBoardObj.summerNoteElements.$editor) selectBoard_initSummerNote();
    else selectBoardObj.summerNoteElements.$editor.show();

    // 버튼 상태 변경
    selectBoard_setBtnShow(false, false, true, true);

    // title, text 내용 채우기
    selectBoard_setModifyMode(true);
}

// 삭제 버튼 클릭시
function selectBoard_onClickDeleteBtn(e) {
    $.ajax({
        url: '/board',
        method: 'delete',
        dataType: 'json',
        data: { id: selectBoardObj.data.id },
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

// 수정 완료 버튼 클릭시
function selectBoard_onClickModifyOkBtn(e) {
    selectBoardObj.data.title = selectBoardObj.titleElements.$input.val();
    selectBoardObj.data.text = selectBoardObj.textElements.$summerNote.html();

    $.ajax({
        url: '/board',
        method: 'patch',
        dataType: 'json',
        data: selectBoardObj.data,
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
    });
}

// 취소 버튼 클릭시
function selectBoard_onClickCancelBtn(e) {
    selectBoard_setBtnShow(true, true, false, false);
    selectBoard_setModifyMode(false);
    selectBoardObj.summerNoteElements.$editor.hide();
}

// 버튼 상태 변경
function selectBoard_setBtnShow(isModify = false, isDelete = false, isModifyOk = false, isCancel = false) {
    selectBoardObj.btnElements.modify.hidden = !isModify;
    selectBoardObj.btnElements.delete.hidden = !isDelete;
    selectBoardObj.btnElements.modifyOk.hidden = !isModifyOk;
    selectBoardObj.btnElements.cancel.hidden = !isCancel;
}

// 수정 모드 설정
function selectBoard_setModifyMode(isMode) {
    if (isMode) {
        selectBoardObj.titleElements.$span.hide();
        selectBoardObj.titleElements.$input.show();
        selectBoardObj.textElements.$standard.hide();

        selectBoardObj.titleElements.$input.val(selectBoardObj.data.title);
        selectBoardObj.textElements.$summerNote.html(selectBoardObj.data.text);
    } else {
        selectBoardObj.titleElements.$span.show();
        selectBoardObj.titleElements.$input.hide();
        selectBoardObj.textElements.$standard.show();

        selectBoardObj.titleElements.$span.text(selectBoardObj.data.title);
        selectBoardObj.textElements.$standard.html(selectBoardObj.data.text);
    }
}
