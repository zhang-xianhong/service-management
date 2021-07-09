export const SERVICE_LEVEL: any = {
  1: '通用',
  2: '行业',
  3: '租户',
};

/**
 * 获取共享权限
 * @param platformShareType
 * @returns
 */
export const getSharedType = (platformShareType: number) => {
  switch (platformShareType) {
    case 1:
      return '引用';
    case 2:
      return '克隆';
    case 3:
      return '克隆,引用';
    case 0:
    default:
      return '';
  }
};

/**
 * 获取服务来源
 * @param platformType
 */
export const getServiceSource = (platformType: number) => {
  switch (platformType) {
    case 1:
      return '自研新建';
    case 2:
      return '平台共享';
    case 3:
      break;
  }
};
