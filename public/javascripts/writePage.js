const writePageObj = {
	summerNoteElem: null,
	image: {
		files: [],
		elements: [],
	},
};

window.addEventListener('load', function (e) {
	writePage_initEvent();
	writePage_initSummerNote();
});

function writePage_initEvent() {
	document
		.getElementById('submit')
		.addEventListener('click', writePage_onClickSubmitBtn);
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
			onImageUpload: function (files, editor, welEditable) {
				if (files.length) {
					// 윈도우에서 파일 선택의 기준이 이름 내림차순이어서
					// 오름차순으로 우선 업데이트 하는 기준으로 반복순회
					for (let i = files.length - 1; i >= 0; i--) {
						write_thumbnailImageFile(files[i], this);
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
					if (
						item.kind === 'file' &&
						item.type.includes('image') == true
					) {
						e.preventDefault();
					}
				}
			},
			// 사진 클릭 후 나타나는 UI에서 삭제 버튼(휴지통 모양)을 누르면 호출되는 함수
			onMediaDelete: function (target) {
				// 배열에 저장해둔 이미지들의 엘리먼트와 동일한 타겟이 있으면 배열에서 제거해준다.
				for (let i = 0; i < writePageObj.image.elements.length; i++) {
					const findIdx = writePageObj.image.elements.indexOf(
						target[0]
					);
					if (findIdx != -1) {
						writePageObj.image.elements.splice(findIdx, 1);
						writePageObj.image.files.splice(findIdx, 1);
					}
				}
			},
		},
	});
}

async function writePage_onClickSubmitBtn(e) {
	e.preventDefault();

	const title = document.getElementsByClassName('title-text')[0].value;
	if (title == '') {
		Swal.fire({
			icon: 'error',
			text: '제목을 입력해주세요!',
		});
		return;
	}
	const summerNoteText = writePageObj.summerNoteElem.summernote('code');

	if (summerNoteText == '') {
		Swal.fire({
			icon: 'error',
			text: '본문을 입력해주세요!',
		});
		return;
	}

	// 서버에 이미지 업로드 요청
	// 섬머노트 에디터에 있는 이미지 요소들을 가져온다.
	const imageSelectors = document.querySelectorAll('div.note-editable img');

	for (let i = 0; i < imageSelectors.length; i++) {
		const findIdx = writePageObj.image.elements.indexOf(imageSelectors[i]);
		if (findIdx != -1) {
			// 서버에 이미지파일 업로드 요청을 한다. response로 ImagePath를 받아온다.
			write_sendImageFile(writePageObj.image.files[findIdx], imageSelectors[i]); 
		}
	}

	setTimeout(() => {
		// 사진 데이터 업로드 후 바뀐 태그가 발생하므로 다시 받아준다.
		const finalText = writePageObj.summerNoteElem.summernote('code');

		console.log(finalText);

		// 서버에 게시 글 post 요청
		const postData = {
			title: title,
			text: finalText,
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
	}, 2000);

	
}
// 썸머노트 사진추가시 에디터에 보여줄 이미지 파일을 가공한다.
function write_thumbnailImageFile(file, editor) {
	const reader = new FileReader();

	// const saveFileData = file.lastModifiedDate + file.name + file.size;

	// 파일 로드가 끝나면 호출될 이벤트 함수
	reader.onload = function (e) {
		// base64를 Blob 포맷으로 변경
		const src = window.URL.createObjectURL(
			base64StringToBlob(e.target.result)
		);

		$(editor)
			.summernote('insertImage', src, file.name)
			.then(function () {
				// 썸머노트에 이미지 삽입이 끝난 후 해당 이미지 선택자를 찾아서
				// 고유 데이터를 추가해준다.
				const currentImgArray = document.querySelectorAll(
					'div.note-editable img'
				);
				const currentIdx = currentImgArray.length - 1;
				writePageObj.image.elements.push(currentImgArray[currentIdx]);
				writePageObj.image.files.push(file);
			});
	};

	reader.readAsDataURL(file);
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

function write_sendImageFile(file, selector) {
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
			const resFilePath = res.path.replace('public', '');

			// 이미지 태그의 소스 경로를 업데이트 한 파일로 수정한다.
			selector.src = resFilePath;

			// 섬머노트에 이미지 삽입
			//$(editor).summernote('insertImage', filePath);
		},
	});
}

// base64 포맷의 url을 file데이터로 변환시켜주는 함수
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
