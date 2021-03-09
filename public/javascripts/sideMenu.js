window.addEventListener('load', function () {
    initEvent();
    loginChecking();
});

function initEvent() {}

// 로그인 체크 관련 함수
function loginChecking() {
    fetch('/users/loginCheck', {
        method: 'get',
    })
        .then(function (res) {
            res.text().then(function (text) {
                console.log(text);
            });
            console.log(res.status);
            res.json().then((data) => {
                console.log(data);
            });
        })
        .then(function (data) {
            console.log(data);
        })
        .catch(function (err) {
            console.error(err);
        });

    loginStateChange(true);
}
function loginStateChange(isLogin) {
    // 로그인 되어있으면 isLogin == true
    document.getElementById('btn-login').hidden = !isLogin;
    document.getElementById('btn-logout').hidden = isLogin;
}
