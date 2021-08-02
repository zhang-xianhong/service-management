import { genId } from '@/utils/util';

/**
 * 校验名称
 * @param name
 * @param list
 * @param id
 * @returns
 */
export const validName = (name: string, list: any[], id: string) => {
  if (!name) {
    return '接口名称不能为空';
  }
  if (!/^[A-Za-z_]+\w?$/.test(name)) {
    return '接口名称仅支持字母、数字、下划线，且不能以数字开头';
  }
  if (name.length > 256) {
    return '接口名称最多支持256个字符';
  }
  const nameLowerCase = name.toLocaleLowerCase();
  const hasRepeat = list.find((item) => item.$id !== id && item.name.toLocaleLowerCase() === nameLowerCase);
  if (hasRepeat) {
    return '接口名称已存在(不区分大小写)';
  }
  return false;
};

/**
 * 校验URL
 * @param url
 * @param list
 * @param id
 * @returns
 */
export const validUrl = (url: string, list: any[], id: string) => {
  if (!url) {
    return 'Path不能为空';
  }
  if (url.length > 500) {
    return 'Path最多支持500个字符';
  }
  if (!/^((\/[a-zA-Z0-9-_]+)*\/?)$/.test(url)) {
    return 'Path格式错误, 仅支持数字、字母、中划线（-）、下划线（_）、斜杠(/), 且必须以斜杠(/)开头';
  }
  const current = list.find((item) => item.$id === id);
  const urlLowerCase = url.toLocaleLowerCase();
  const hasRepeat = list.find(
    (item) =>
      item.$id !== id && current.methodType !== item.methodType && item.url.toLocaleLowerCase() === urlLowerCase,
  );
  if (hasRepeat) {
    return 'URL已存在(不区分大小写)';
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
export const parseList = (rows: any[]) =>
  rows.map((item) => {
    const newItem: any = {};
    newItem.$id = item.uniqueId || item.$id || genId();
    newItem.id = item.uniqueId || null;
    newItem.name = item.name || '';
    newItem.url = item.url || '';
    newItem.methodType = item.methodType || '';
    newItem.description = item.description || '';
    newItem.modelId = item.modelId || '';
    newItem.modelName = item.modelName || '';
    newItem.isSystem = item.isSystem || false;
    return newItem;
  });
