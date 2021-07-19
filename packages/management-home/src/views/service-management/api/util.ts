export const validName = (name: string) => {
  if (!name) {
    return '接口名称不能为空';
  }
  if (!/^[A-Za-z_]+\w?$/.test(name)) {
    return '接口名称仅支持字母、数字、下划线，且不能以数字开头';
  }
  if (name.length > 256) {
    return '接口名称最多支持256个字符';
  }
  return false;
};

export const validUrl = (url: string) => {
  if (!url) {
    return 'URL不能为空';
  }
  if (url.length > 500) {
    return 'URL最多支持500个字符';
  }
  return false;
};

export const validDescription = (desc: string) => {
  if (!desc) {
    return '描述不能为空';
  }
  if (desc.length > 500) {
    return '描述最多支持512个字符';
  }
  return false;
};
