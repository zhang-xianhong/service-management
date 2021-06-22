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
  const szReg = /[\u4e00-\u9fa5]{2,64}/;
  return szReg.test(name);
}
// 英文名称校验2个字符以上
export function checkEnName(name: string): boolean {
  const szReg = /^[A-Za-z]{2,64}$/;
  return szReg.test(name);
}
// 手机号校验
export function checkMobile(value: string): boolean {
  const subValue = value.replace(/[^-|\d]/g, '');
  return /^(1)\d{10}$/.test(subValue);
}
// 自定义密码校验  长度在 8 到 16 个字符,只能输入大小写字母、数字、特殊字符（(!@#$%^&),至少1个大写字母，1个小写字母
export function checkPasswd(passwd: string): boolean {
  const szReg = /^(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d（!@#$%^&)]{8,16}$/;
  return szReg.test(passwd);
}

// -------------------------------------------------------------------
// 组件库form表单校验器 async-valitor
export const HELP_MSG =
  '长度在 8 到 16 个字符，只能输入大小写字母、数字、特殊字符（(!@#$%^&),至少1个大写字母，1个小写字母';
// 密码校验
const validatorPassword = (rule: any, value: string, callback: Function) => {
  if (!checkPasswd(value)) {
    callback(new Error(HELP_MSG));
  }
  callback();
};
export const PasswordRules = [
  { required: true, message: '请输入新的密码', trigger: 'blur' },
  { validator: validatorPassword, trigger: 'blur' },
];
export const uploadValidate = (instance: any, file: { size: number; name: string }) => {
  if (!/\.jp(e)?g|png|gif|bmp$/i.test(file.name)) {
    (instance as any).proxy.$message({
      type: 'warning',
      message: '图片格式错误，仅支持bmp,jpg,png,jpeg格式图片',
    });
    return false;
  }
  if (file.size > 1024 * 1024 * 3) {
    (instance as any).proxy.$message({
      type: 'warning',
      message: '上传图片大小不能超过 3Mb',
    });
    return false;
  }
};
