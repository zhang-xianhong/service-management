// 0 表示 api地址， // 1 表示mock地址
export default {
  GET_USER_MESSAGE: ['/users/info', '/mock/auth/user-mess.json'],
  POST_CURRENT_PROJECT: ['/projects/switch'],
  GET_HEALTH: ['/health', '/mock/auth/health.json'],
  LOGOUT: ['/logout'],
  GET_CAPTCHA: ['/auth/captcha', 'mock/auth/captcha.json'],
  LOGIN: ['/login', 'mock/auth/login.json'],
  CODE: ['auth/login/code', 'mock/auth/code.json'],
  VERIFY_CAPTCHA: ['/auth/captcha/verify', 'mock/auth/verify.json'],
};
