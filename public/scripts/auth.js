const auth = {
  async isLogin() {
    const response = await serverUtils.getFetching('/auth/loginCheck', {
      'Content-Type': 'application/json',
    });
    return response?.isLogin == true;
  },
  async getLoginUserInfo() {
    const response = await serverUtils.getFetching('/auth/loginCheck', {
      'Content-Type': 'application/json',
    });
    return response;
  },
};
