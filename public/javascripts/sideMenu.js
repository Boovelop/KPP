window.addEventListener('load', function () {
	initEvent();
	loginStateChange();
});

function initEvent() {
	// document.getElementById('btn-logout').addEventListener('click', clickLogoutBtn);
	// document.getElementById('btn-login').addEventListener('click', clickLoginBtn);
}

function loginStateChange() {
	loginCheck().then(function (result) {
		// 로그인 되어있으면 result == true
		document.getElementById('btn-login').hidden = result;
		document.getElementById('btn-logout').hidden = !result;
	});
}

function clickLoginBtn(e) {
	e.preventDefault();
}
function clickLogoutBtn(e) {
	e.preventDefault();
}
