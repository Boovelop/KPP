const writePageObj = {
    summerNoteElem: null,
};

window.addEventListener('load', function (e) {
    writePage_initEvent();
    writePage_initSummerNote();
});

function writePage_initEvent() {
    document.getElementById('submit').addEventListener('click', writePage_onClickSubmitBtn);
}

function writePage_initSummerNote() {
    writePageObj.summerNoteElem = $('#summer-note').summernote({
        lang: 'ko-KR',
        height: '37vh',
        // placeholder: '최대 2048자까지 입력이 가능합니다',
        toolbar: [
            // [groupName, [list of button]]
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
            // 	var clipboardData = e.originalEvent.clipboardData;
            // 	if (clipboardData && clipboardData.items && clipboardData.items.length) {
            // 		var item = clipboardData.items[0];
            // 		if (item.kind === 'file' && item.type.indexOf('image/') !== -1) {
            // 			e.preventDefault();
            // 		}
            // 	}
            // }
        },
    });
}
function writePage_onClickSubmitBtn(e) {
    e.preventDefault();

    const title = document.getElementsByClassName('title-text')[0].value;
    if (title == '') {
        Swal.fire({
            icon: 'error',
            text: '제목을 입력해주세요!',
        });
        return;
    }
    const text = writePageObj.summerNoteElem.summernote('code');

    if (text == '') {
        Swal.fire({
            icon: 'error',
            text: '본문을 입력해주세요!',
        });
        return;
    }

    // 서버에 게시 글 post 요청
    const postData = {
        title: title,
        text: text,
        author: document.getElementById('author').textContent,
    };

    fetch('/board', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    }).then(function (res) {
        console.log(res);
        if (res.status == 200) {
            Swal.fire({
                icon: 'success',
                text: '글쓰기 성공!',
            }).then(function () {
                window.location.href = '/community';
            });
        }
    });
}
