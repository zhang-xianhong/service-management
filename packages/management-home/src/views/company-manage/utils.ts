import { ElMessage } from 'element-plus';
// 随机密码生成
export function generatePasswd(len: number): string {
  let length = Number(len);
  // Limit length
  if (length < 6) {
    length = 6;
  } else if (length > 16) {
    length = 16;
  }
  const passwordArray = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '1234567890', '@$!%*?&'];
  const password = [];
  let n = 0;
  for (let i = 0; i < length; i++) {
    // If password length less than 9, all value random
    if (password.length < length - 4) {
      // Get random passwordArray index
      const arrayRandom = Math.floor(Math.random() * 4);
      // Get password array value
      const passwordItem = passwordArray[arrayRandom];
      // Get password array value random index
      // Get random real value
      const item = passwordItem[Math.floor(Math.random() * passwordItem.length)];
      password.push(item);
    } else {
      // If password large then 9, lastest 4 password will push in according to the random password index
      // Get the array values sequentially
      const newItem = passwordArray[n];
      const lastItem = newItem[Math.floor(Math.random() * newItem.length)];
      // Get array splice index
      const spliceIndex = Math.floor(Math.random() * password.length);
      password.splice(spliceIndex, 0, lastItem);
      n = n + 1;
    }
  }
  return password.join('');
}

// 复制功能
export function copyFun(content: string) {
  const input = document.createElement('input');
  input.setAttribute('readonly', 'readonly');
  document.body.appendChild(input);
  input.setAttribute('value', content);
  input.select();
  if (document.execCommand('copy')) {
    document.execCommand('copy');
    ElMessage({
      type: 'success',
      message: '新密码已复制在剪贴板中，请及时粘贴',
    });
  }
  document.body.removeChild(input);
}
