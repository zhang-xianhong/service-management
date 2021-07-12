/**
 * 获取服务显示名称
 * @param name
 * @returns
 */
export const getServiceShowName = (name: string) => {
  const names = String(name || '').split(/\./gm);
  return names[names.length - 1] || name;
};
