const sideMenuObj = {
    isSideOn: false,
};

window.addEventListener('load', function () {
    sideMenu_init();
    sideMenu_initEvent();
    sideMenu_loginStateChange();
});
function sideMenu_init() {}

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
            document.getElementById('side-userInfo').style.visibility = 'visible';
        } else document.getElementById('side-userInfo').style.visibility = 'hidden';
    });
}
function sideMenu_clickSideOnoffBtn(e) {
    if (sideMenuObj.isSideOn) {
        // on으로 바꿔준다.
        document.getElementById('btn-sideOnOffIcon').classList.add('fa-angle-double-left');
        document.getElementById('btn-sideOnOffIcon').classList.remove('fa-angle-double-right');

        document.getElementById('side-content').classList.remove('sideMenu-on');
    } else {
        // off로 바꿔준다.
        document.getElementById('btn-sideOnOffIcon').classList.add('fa-angle-double-right');
        document.getElementById('btn-sideOnOffIcon').classList.remove('fa-angle-double-left');

        document.getElementById('side-content').classList.add('sideMenu-on');
    }

    sideMenuObj.isSideOn = !sideMenuObj.isSideOn;
}
