// 0 表示 api地址， // 1 表示mock地址
export default {
  GET_TENANT_LIST: ['/tenants', '/mock/tenant/tenant-list.json'],
  GET_TENANT_DEPT: ['/tenants/department/tree', '/mock/tenant/tenant-department.json'],
  GET_TENANT_DETAIL: ['/tenants/info', '/mock/tenant/tenant-detail.json'],
  UPDATE_TENANT: ['/tenants/info', 'mock/services/delete.json'],
  QUERY_IN_TENT: ['/users/search', 'mock/tenant/tenant-department.json'],
  // '/tenants/search/users'
  SEND_RETRIEVE_PASSWD_VERIFY_CODE: [
    '/users/sendRetrievePasswordVerifyCode',
    '/mock/tenant/tenant-sendVerifyCode.json',
  ],
  RETRIEVE_PASSWD: ['/users/retrievePassword', '/mock/tenant/tenant-retrievePassword.json'],
};
