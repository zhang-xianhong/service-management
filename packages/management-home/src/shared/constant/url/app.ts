// 0 表示 api地址， // 1 表示mock地址
export default {
  GET_APPS: ['/apps', '/mock/app/app-list.json'],
  GET_APP_DETAIL: ['/apps/_', '/mock/app/app-detail.json'],
  UPDATE_APP: ['/apps/_', 'mock/app/app-update.json'],
  DELETE_APP: ['/apps/delete/_', 'mock/app/app-update.json'],
  CREATE_APP: ['/apps', 'mock/app/app-update.json'],
  VALIDATE_NAME: ['/apps/name/usable', 'mock/app/validate-name.json'],
};
