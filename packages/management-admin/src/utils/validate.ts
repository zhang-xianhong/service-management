export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

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

// 自定义密码校验  长度在 8 到 16 个字符,只能输入大小写字母、数字、特殊字符（(!@#$%^&),至少1个大写字母，1个小写字母
export function checkPasswd(passwd: string): boolean {
  const szReg = /^(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d（!@#$%^&)]{8,16}/;
  return szReg.test(passwd);
}
