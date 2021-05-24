// 0 表示 api地址， // 1 表示mock地址
export default {
  GET_USER_INFO: ['/user/info', 'mock/user/info.json'],
  UPDATE_USER_INFO: ['/user/update', 'mock/user/update.json'],
  GET_PROFILE: ['users/profile', 'mock/user/profile.json'],
  UPDATE_PROFILE: ['users/update/profile', 'mock/user/update.json'],
  UPDATE_PROFILE_PASSWORD: ['users/update/profile/password', 'mock/user/update.json'],
};
