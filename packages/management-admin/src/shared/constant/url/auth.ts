// 0 表示 api地址， // 1 表示mock地址
export default {
  LOGOUT: ['/logout'],
  GET_CAPTCHA: ['/auth/captcha', 'mock/auth/captcha.json'],
  LOGIN: ['api/login', 'mock/auth/login.json'],
  CODE: ['auth/login/code', 'mock/auth/code.json'],
  VERIFY_CAPTCHA: ['/auth/captcha/verify', 'mock/auth/verify.json'],
};
