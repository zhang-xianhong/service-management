// 0 表示 api地址， // 1 表示mock地址
export default {
  GET_TENANT_LIST: ['/tenants', '/mock/tenant/tenant-list.json'],
  GET_TENANT_DEPT: ['/tenants/department/tree', '/mock/tenant/tenant-department.json'],
  GET_TENANT_DETAIL: ['/tenants/_', '/mock/tenant/tenant-detail.json'],
  UPDATE_TENT: ['/tenants/_', 'mock/services/delete.json'],
  QUERY_IN_TENT: ['/tenants/search/users', 'mock/tenant/tenant-department.json'],
};
