// 0 表示 api地址， // 1 表示mock地址
export default {
  GET_MODEL_LIST: ['/models', '/mock/schema/model-list.json'],
  GET_MODEL_LIST_ALL: ['/models/all', '/mock/schema/model-list-all.json'],
  GET_SERVICE_MODEL_LIST: ['/services/models', '/mock/schema/service-model-list.json'],
  GET_MODEL_DETAIL: ['/models', '/mock/schema/model-detail.json'],
  CREATE_MODEL: ['/models', '/mock/schema/model-create.json'],
  UPDATE_MODEL: ['/models', '/mock/schema/model-update.json'],
  DELETE_MODEL: ['/models/delete', 'mock/schema/model-delete.json'],
  CREATE_RELATION: ['/models/relation', 'mock/schema/model-create.json'],
  UPDATE_RELATION: ['/models/relation/_', 'mock/schema/model-create.json'],
  REMOVE_RELATION: ['/models/relation/delete', 'mock/schema/model-create.json'],
  UPDATE_CONFIG: ['/services/config', 'mock/schema/model-create.json'],
  UPDATE_FIELDS: ['/models/_/fields', 'mock/schema/model-create.json'],
};
