import { getCurrentInstance } from '@vue/runtime-core';
import { useRouter } from 'vue-router';

export default function () {
  // 获取组件实例
  const instance = getCurrentInstance();
  const msgTips = (type: string, content: string) => {
    (instance as any).proxy.$message({
      type,
      message: content,
    });
  };

  const router = useRouter();
  const goLoginPages = (seconds?: number) => {
    // 跳转到登录页面
    setTimeout(() => {
      router.push({
        name: 'login',
      });
    }, seconds ?? 3e3);
  };
  return {
    msgTips,
    goLoginPages,
  };
}
