// 0 表示 api地址， // 1 表示mock地址
export default {
  GET_USER_MESSAGE: ['/users/info', '/mock/auth/user-mess.json'],
  POST_CURRENT_PROJECT: ['/projects/switch'],
  GET_HEALTH: ['/health', '/mock/auth/health.json'],
  LOGOUT: ['/logout'],
  GET_CAPTCHA: ['/auth/captcha', 'mock/auth/captcha.json'],
  LOGIN: ['auth/login', 'mock/auth/login.json'],
  GET_PROFILE: ['/users/profile', 'mock/auth/user-profile.json'],
  UPDATE_PROFILE: ['/users/update/profile', 'mock/auth/update-profile.json'],
  UPDATE_PASSWORD: ['/users/update/profile/password', 'mock/auth/update-password.json'],
};
