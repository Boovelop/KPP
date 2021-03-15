// 로그인 체크 관련 함수
async function common_loginCheck() {
    let response = await fetch('/auth/loginCheck', {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    });

    let result = false;
    if (response.ok) {
        let data = await response.json();
        return data;
    }

    return null;
}
// 스크랩 함수
async function common_getScraping(url, type) {
    if (type == null) {
        console.error('Type error');
        return null;
    }

    const fullURL = '/files/scraping/?url=' + url + '&type=' + type;
    let response = await fetch(fullURL, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        // if (typeof response == 'object') data = await response;
        let data = await response.json();
        return data;
    }

    return null;
}
