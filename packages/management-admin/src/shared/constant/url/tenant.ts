// 0 表示 api地址， // 1 表示mock地址
export default {
  GET_TENANT_LIST: ['/tenants', '/mock/tenant/tenant-list.json'],
  GET_TENANT_DETAIL: ['/tenants/_', '/mock/tenant/tenant-detail.json'],
  DELETE_TENANT: ['/tenants/delete/_', '/mock/services/delete.json'],
  FREEZE_TENANT: ['/tenants/freeze/_', '/mock/services/delete.json'],
  ENABLE_TENANT: ['/tenants/enable/_', '/mock/services/delete.json'],
  CREATE_TENANT: ['/tenants', '/mock/services/delete.json'],
  UPDATE_TENT: ['/tenants/_', 'mock/services/delete.json'],
  VALIDATE_NAME: ['/tenants/name/usable', 'mock/services/validate.json'],
  VALIDATE_LICENSE: ['/tenants/license/usable', 'mock/services/validate.json'],
  VALIDATE_ENGABBR: ['/tenants/engAbbr/usable', 'mock/services/validate.json'],
  VALIDATE_ACCOUNT: ['/tenants/account/usable', 'mock/services/validate.json'],
  UPDATE_TENANT_PASSWD: ['/users/update/password', '/mock/services/delete.json'],
  SEND_MAIL_FOR_RESET_PASSWORD: ['/users/send/email', '/mock/services/delete.json'],
  VERIFY_CODE_VALID_FOR_RESET_PASSWORD: ['/users/verify/password/code', '/mock/services/delete.json'],
};
