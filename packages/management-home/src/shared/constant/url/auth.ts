// 0 表示 api地址， // 1 表示mock地址
export default {
  GET_USER_MESSAGE: ['/users/info', '/mock/auth/user-mess.json'].reverse(),
  POST_CURRENT_PROJECT: ['/projects/switch'],
  GET_HEALTH: ['/health', '/mock/auth/health.json'],
  LOGOUT: ['/logout'],
  GET_CAPTCHA: ['/auth/captcha', 'mock/auth/captcha.json'],
  LOGIN: ['auth/login', 'mock/auth/login.json'],
};
