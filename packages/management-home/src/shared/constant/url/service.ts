// 0 表示 api地址， // 1 表示mock地址
export default {
  GET_SERVICE_LIST: ['/services', '/mock/services/list.json'],
  ADD_SERVICE: ['/services', '/mock/services/create.json'],
  UPDATE_SERVICE: ['/services/_', '/mock/services/update.json'],
  GET_SERVICE_BY_ID: ['/services/_', '/mock/services/service-detail.json'],
  BUILD_SERVICE: ['/services/build', '/mock/services/service-build.json'],
  INIT_SERVICE: ['/services/init/_', '/mock/services/service-init.json'],
  DELETE_SERVICR: ['/services/delete'],
  GET_SERVICE_APIS: ['/services/apis', '/mock/services/api-list.json'],
  UPDATE_SERVICE_APIS: ['/services/_/apis', '/mock/services/api-update.json'],
  GET_LOG_RUNTIME: ['/logs/runtime'],
  GET_CHANGES: ['/services/_/changes'],
  POST_CHANGES_APPLY: ['/services/changes/apply'],
  START_SERVICE: ['/services/start'],
  STOP_SERVICE: ['/services/stop'],
  SERVICE_NAME_TEST: ['/services/name/usable'],
  GET_SERVICE_TRACE_ID: ['/logs/runtime/traceid/', '/mock/services/service-trace-id.json'],
};
