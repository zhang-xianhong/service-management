// ----------------------------------
import { computed, reactive, ref, Ref } from 'vue';
export const enum ResetMethods {
  RandomPassword = 1,
  SendMail,
}
export interface SelectOption {
  value: ResetMethods;
  label: string;
}
type Current = Ref<ResetMethods | ''>;
export interface FormConfiguraion {
  options: SelectOption[];
  current: Current;
  isRandom: Ref<boolean>;
}
const RESET_OPTIONS: SelectOption[] = [
  {
    value: ResetMethods.RandomPassword,
    label: '随机密码',
  },
  {
    value: ResetMethods.SendMail,
    label: '邮箱重置',
  },
];
export const useResetOptions = () => {
  // 重置密码表单对话框配置数据
  const current: Current = ref('');
  const isRandom = computed(() => current.value === ResetMethods.RandomPassword);

  const configuraion: FormConfiguraion = {
    options: RESET_OPTIONS,
    current,
    isRandom,
  };

  const reset = () => {
    // reset do default
    current.value = '';
  };

  return {
    configuraion: reactive(configuraion),
    reset,
  };
};
