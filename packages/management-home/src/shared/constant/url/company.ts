export default {
  GET_USER_LIST: ['/users', '/mock/company/users.json'],
  CREATE_USER: ['/users', '/mock/company/create.json'],
  UPDATE_USER: ['/users/_', '/mock/company/update.json'],
  DEL_USER: ['/users/delete', '/mock/company/del.json'],
  UPDATE_USER_STATUS: ['/users/update/status', '/mock/company/status.json'],
  GET_DEPT_LIST: ['/dept', '/mock/company/depts.json'],
  CREATE_DEPT: ['/departments', '/mock/company/create.json'],
  UPDATE_DEPT: ['/departments/_', '/mock/company/create.json'],
  DEL_DEPT: ['/departments/delete/_', '/mock/company/del.json'],
  ADD_USER: ['/departments/_/members', '/mock/company/create.json'],
  UPDATE_USER_PASSWD: ['/users/update/password', '/mock/company/create.json'],
  DEL_DEPT_USER: ['/departments/delete/members', '/mock/company/create.json'],
  CHECK_INPUT: ['/users/useable', '/mock/company/able.json']
};
