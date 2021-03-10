window.addEventListener('load', function () {
    getScraping('https://finance.naver.com/item/main.nhn?code=035900').then(function (res) {
        console.log(res);
    });
});

async function getScraping(url) {
    console.log('스크래핑 시작');
    const fullURL = '/files/scraping/?url=' + url;
    let response = await fetch(fullURL, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        let data = await response.json();
        return data;
    }

    return null;
}
