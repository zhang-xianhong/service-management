export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

// 邮箱校验
export function checkMail(szMail: string): boolean {
  const szReg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;
  return szReg.test(szMail);
}
// 中文姓名校验2个字以上
export function checkZNName(name: string): boolean {
  const szReg = /[\u4e00-\u9fa5]{2,}/;
  return szReg.test(name);
}
// 英文名称校验2个字符以上
export function checkEnName(name: string): boolean {
  const szReg = /[A-Za-z\d]{2,}/;
  return szReg.test(name);
}
// 手机号校验
export function checkMobile(value: string): boolean {
  const subValue = value.replace(/[^-|\d]/g, '');
  return /^(1)\d{10}$/.test(subValue);
}
