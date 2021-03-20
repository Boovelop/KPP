window.addEventListener('load', function (e) {
	writePage_initEvent();
	writePage_initSummerNote();
});

function writePage_initEvent() {
	document.getElementById('submit').addEventListener('click', writePage_onClickSubmitBtn);
}

function writePage_initSummerNote() {
	$('#summer-note').summernote({
		height: '25vw',
	});
}
function writePage_onClickSubmitBtn(e) {
	e.preventDefault();

	const title = document.getElementById('title-text').textContent;

	if (title == '') {
		Swal.fire({
			icon: 'error',
			text: '제목을 입력해주세요!',
		});
	}
}
