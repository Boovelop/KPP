window.addEventListener('load', function () {
	initEvent();
	loginStateChange();
});

function initEvent() {}

function loginStateChange() {
	loginCheck().then(function (result) {
		// 로그인 되어있으면 result == true
		document.getElementById('btn-login').hidden = result;
		document.getElementById('btn-logout').hidden = !result;
	});
}
