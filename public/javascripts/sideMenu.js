window.addEventListener('load', function () {
    initEvent();
    loginChecking();
});

function initEvent() {}

// 로그인 체크 관련 함수
async function loginChecking() {
    let response = await fetch('/users/loginCheck', {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    });

    let result = false;
    if (response.ok) {
        let data = await response.json();
        console.log('로그인 체크', data);
        result = data.result;
    }

    loginStateChange(result);
}
function loginStateChange(isLogin) {
    // 로그인 되어있으면 isLogin == true
    document.getElementById('btn-login').hidden = isLogin;
    document.getElementById('btn-logout').hidden = !isLogin;
}
