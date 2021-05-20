// 0 表示 api地址， // 1 表示mock地址
export default {
  GET_PUBLISH_INFO: ['/demands/publish/_', 'mock/settings/config.json'],
  GET_PUBLISH_LIST: ['/demands/publish', 'mock/settings/config.json'],
  GET_PUBLISH_REVIEW_LIST: ['/demands/publish/review', 'mock/settings/config.json'],
  ADD_PUBLISH: ['/demands/publish', 'mock/settings/config-add.json'],
  UPDATE_PUBLISH: ['/demands/publish/_', 'mock/settings/config-update.json'],
  DELETE_PUBLISH: ['/demands/publish/delete/_', 'mock/settings/config-delete.json'],
  REVIEW_PUBLISH: ['/demands/publish/review/_', 'mock/settings/config-history.json'],
};
