const sideMenuObj = {
    isSideOn: false,
    content: {
        element: HTMLElement,
        childElements: HTMLElement,
    },
};

window.addEventListener('load', function () {
    sideMenu_init();
    sideMenu_initEvent();
    sideMenu_loginStateChange();
});
function sideMenu_init() {
    sideMenuObj.content.element = document.getElementById('side-content');
    sideMenuObj.content.childElements = sideMenuObj.content.element.childNodes;
}

function sideMenu_initEvent() {
    document.getElementById('btn-sideOnOff').addEventListener('click', sideMenu_clickSideOnoffBtn);
}

function sideMenu_loginStateChange() {
    common_loginCheck().then(function (response) {
        // 로그인 되어있으면 result == true
        document.getElementById('btn-login').hidden = response.isLogin;
        document.getElementById('btn-logout').hidden = !response.isLogin;
        if (response.isLogin) {
            document.getElementById('user-name').textContent = response.userName;
            document.getElementById('side-userInfo').hidden = false;
        } else document.getElementById('side-userInfo').hidden = true;
    });
}
function sideMenu_clickSideOnoffBtn(e) {
    if (sideMenuObj.isSideOn) {
        // on으로 바꿔준다.
        document.getElementById('btn-sideOnOffIcon').classList.add('fa-angle-double-left');
        document.getElementById('btn-sideOnOffIcon').classList.remove('fa-angle-double-right');

        sideMenuObj.content.element.classList.remove('sideMenu-on');

        for (let i = 0; i < sideMenuObj.content.childElements.length; i++) {
            sideMenuObj.content.childElements[i].style.transition = 'opacity 0.3s ease-in-out;';
            sideMenuObj.content.childElements[i].style.opacity = 0;
        }
    } else {
        // off로 바꿔준다.
        document.getElementById('btn-sideOnOffIcon').classList.add('fa-angle-double-right');
        document.getElementById('btn-sideOnOffIcon').classList.remove('fa-angle-double-left');

        sideMenuObj.content.element.classList.add('sideMenu-on');

        for (let i = 0; i < sideMenuObj.content.childElements.length; i++) {
            sideMenuObj.content.childElements[i].style.transition = 'opacity 1s ease-in-out;';
            sideMenuObj.content.childElements[i].style.opacity = 1;
        }
    }

    sideMenuObj.isSideOn = !sideMenuObj.isSideOn;
}
