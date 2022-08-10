const sideMenu = {
  areaElements: {
    contents: null,
    contentsChildren: null,
    userInfo: null,
  },
  textElements: {
    userName: null,
  },
  btnElements: {
    open: null,
    close: null,
    login: null,
    logout: null,
  },

  initBindElements() {
    this.areaElements.contents = document.getElementById('side-contents');
    this.areaElements.contentsChildren = this.areaElements.contents.childNodes;
    this.areaElements.userInfo = document.getElementById('side-userInfo');
    this.btnElements.open = document.getElementById('btn-sideMenuOpen');
    this.btnElements.close = document.getElementById('btn-sideMenuClose');
    this.btnElements.login = document.getElementById('btn-login');
    this.btnElements.logout = document.getElementById('btn-logout');
    this.textElements.userName = document.getElementById('user-name');
  },

  async initState() {
    const response = await auth.getLoginUserInfo();
    const { isLogin, userName } = response;

    this.btnElements.login.hidden = isLogin;
    this.btnElements.logout.hidden = !isLogin;

    if (isLogin) {
      this.textElements.userName.textContent = userName;
      this.areaElements.userInfo.hidden = false;
    } else {
      this.areaElements.userInfo.hidden = true;
    }
  },

  initEventListener() {
    this.btnElements.open.addEventListener('click', this.onClickOpenBtn);
    this.btnElements.close.addEventListener('click', this.onClickCloseBtn);
  },

  // ------------------- EventListener -------------------
  // 이벤트 리스너에서의 this는 리스너에 연결된 element이다.
  onClickOpenBtn(e) {
    e.preventDefault();
    sideMenu.btnElements.open.hidden = true;
    sideMenu.btnElements.close.hidden = false;
    sideMenu.areaElements.contents.classList.add('sideMenu-on');
    for (const element of sideMenu.areaElements.contentsChildren) {
      element.style.transition = 'opacity 1s ease-in-out;';
      element.style.opacity = 1;
    }
  },

  onClickCloseBtn(e) {
    e.preventDefault();
    sideMenu.btnElements.close.hidden = true;
    sideMenu.btnElements.open.hidden = false;
    sideMenu.areaElements.contents.classList.remove('sideMenu-on');
    for (const element of sideMenu.areaElements.contentsChildren) {
      element.style.transition = 'opacity 0.3s ease-in-out;';
      element.style.opacity = 0;
    }
  },
};

window.addEventListener('load', () => {
  sideMenu.initBindElements();
  sideMenu.initState();
  sideMenu.initEventListener();
});
