// 0 表示 api地址， // 1 表示mock地址
export default {
  GET_SERVICE_LIST: ['/services', '/mock/services/list.json'],
  ADD_SERVICE: ['/services', '/mock/services/create.json'],
  UPDATE_SERVICE: ['/services/_', '/mock/services/update.json'],
  GET_SERVICE_BY_ID: ['/services/_', '/mock/services/service-detail.json'],
<<<<<<< HEAD
  BUILD_SERVICE: ['/services/build', '/mock/services/service-build.json'],
  INIT_SERVICE: ['/services/init/_', '/mock/services/service-init.json'],
=======
  DELETE_SERVICR: ['/services/delete/_'],
>>>>>>> 24ca09b3ae31c0565824255a09b8a1d6ace9a3e4
};
