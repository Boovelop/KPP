const writePageObj = {
    summerNoteElem: null,
    image: {
        files: [],
        elements: [],
        fileInfos: [],
    },
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
            onImageUpload: function (files, editor, welEditable) {
                if (files.length) {
                    // 윈도우에서 파일 선택의 기준이 이름 내림차순이어서
                    // 오름차순으로 우선 업데이트 하는 기준으로 반복순회
                    for (let i = files.length - 1; i >= 0; i--) {
                        write_tempImageFile(files[i], this);
                    }
                }
            },
            onPaste: function (e) {
                var clipboardData = e.originalEvent.clipboardData;
                if (clipboardData && clipboardData.items && clipboardData.items.length) {
                    var item = clipboardData.items[0];
                    if (item.kind === 'file' && item.type.includes('image') == true) {
                        e.preventDefault();
                    }
                }
            },
        },
    });
}
async function writePage_onClickSubmitBtn(e) {
    e.preventDefault();

    const imageSelectors = document.querySelectorAll('div.note-editable img');

    const src = imageSelectors[0].getAttribute('src');
    const fileName = imageSelectors[0].getAttribute('filename');
    const fileData = dataURLtoFile(src, fileName);
    console.log(fileData);
    // console.log(imageSelectors);
    const realFiles = [];
    for (let i = 0; i < imageSelectors.length; i++) {
        // const findIdx = writePageObj.image.elements.indexOf(imageSelectors[i]);
        // if (findIdx != -1) {
        //     realFiles.push(writePageObj.image.files[findIdx]);
        // }
    }
    console.log(realFiles);

    // var imgUrl = [$('#jq-file-input').val()];
    // console.log(imgUrl);
    // document.getElementById

    // const title = document.getElementsByClassName('title-text')[0].value;
    // if (title == '') {
    //     Swal.fire({
    //         icon: 'error',
    //         text: '제목을 입력해주세요!',
    //     });
    //     return;
    // }
    // const text = writePageObj.summerNoteElem.summernote('code');

    // if (text == '') {
    //     Swal.fire({
    //         icon: 'error',
    //         text: '본문을 입력해주세요!',
    //     });
    //     return;
    // }

    // 서버에 게시 글 post 요청
    // const postData = {
    //     title: title,
    //     text: text,
    //     author: document.getElementById('author').textContent,
    // };

    // fetch('/board', {
    //     method: 'post',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(postData),
    // }).then(function (res) {
    //     console.log(res);
    //     if (res.status == 200) {
    //         Swal.fire({
    //             icon: 'success',
    //             text: '글쓰기 성공!',
    //         }).then(function () {
    //             window.location.href = '/community';
    //         });
    //     }
    // });
}
function write_tempImageFile(file, editor) {
    const reader = new FileReader();

    const currentIdx = writePageObj.image.files.length;
    const saveFileData = file.lastModifiedDate + file.name + file.size;

    // 파일 로드가 끝나면 호출될 이벤트 함수
    reader.onload = function (e) {
        $(editor)
            .summernote('insertImage', e.target.result, file.name)
            .then(function () {
                // 썸머노트에 이미지 삽입이 끝난 후 해당 이미지 선택자를 찾아서
                // 고유 데이터를 추가해준다.
                const currentImg = document.querySelectorAll('div.note-editable img')[currentIdx];
                writePageObj.image.elements.push(currentImg);
            });
    };
    writePageObj.image.files.push(file);
    writePageObj.image.fileInfos.push(saveFileData);

    reader.readAsDataURL(file);
}

function write_sendImageFile(file, editor) {
    // 이미지 형식 확인
    if (!file.type.includes('image')) {
        Swal.fire({
            icon: 'warning',
            text: '파일 형식이 이미지가 아닙니다',
        });
        return;
    }

    // 이미지 크기 확인
    const limitImageSize = 5 * 1024 * 1024;
    if (file.size >= limitImageSize) {
        Swal.fire({
            icon: 'warning',
            title: '파일 용량 초과',
            text: '이미지당 5MB미만으로 업로드가 가능합니다',
        });
        return;
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
        success: function (res) {
            // public폴더가 static으로 설정되어 있으니까
            // 경로에서 public을 제외한 나머지 경로를 받아온다.
            const filePath = res.path.replace('public', '');

            // 섬머노트에 이미지 삽입
            $(editor).summernote('insertImage', filePath);
        },
    });
}

const dataURLtoFile = (dataurl, fileName) => {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], fileName, { type: mime });
};

//Usage example:
// var file = dataURLtoFile('data:text/plain;base64,aGVsbG8gd29ybGQ=', 'hello.txt');
