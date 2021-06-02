export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

// 邮箱校验
export function checkMail(szMail: string): boolean {
  const szReg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;
  return szReg.test(szMail);
}
// 中文姓名校验2-16字以上
export function checkZNName(name: string): boolean {
  const szReg = /[\u4e00-\u9fa5]{2,16}/;
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
// 自定义密码校验  长度在 8 到 16 个字符,只能输入大小写字母、数字、特殊字符（(!@#$%^&),至少1个大写字母，1个小写字母
export function checkPasswd(passwd: string): boolean {
  const szReg = /^(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d（!@#$%^&)]{8,16}/;
  return szReg.test(passwd);
}
