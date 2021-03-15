// 0 表示 api地址， // 1 表示mock地址
export default {
  GET_MODEL_LIST: ['/models', '/mock/schema/model-list.json'],
  GET_MODEL_LIST_ALL: ['/models/all', '/mock/schema/model-list-all.json'],
  GET_MODEL_DETAIL: ['/models', '/mock/schema/model-detail.json'],
  CREATE_MODEL: ['/models', '/mock/schema/model-create.json'],
  UPDATE_MODEL: ['/models', '/mock/schema/model-update.json'],
  DELETE_MODEL: ['/models/delete', 'mock/schema/model-delete.json'],
};
