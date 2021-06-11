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
