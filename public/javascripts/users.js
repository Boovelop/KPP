window.addEventListener('load', function (e) {});

// 로그인 체크 관련 함수
async function loginCheck() {
    console.log('로그인체크 시작');
    let response = await fetch('/auth/loginCheck', {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    });

    let result = false;
    if (response.ok) {
        let data = await response.json();
        result = data.result;
    }

    return result;
}
