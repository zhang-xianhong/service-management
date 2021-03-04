import { ref, reactive } from 'vue';

const sendMessageSwitch = ref(true);

export const sendMess = () => {
  sendMessageSwitch.value = !sendMessageSwitch.value;
};

export const baseInfoForm = reactive({});

export const runParamsForm = reactive({});

export const openSetForm = reactive({
  openObject: '',
});

export const codeTemplateForm = reactive({
  others: [],
});

export const heigherSetForm = reactive({
  others: [],
});

export const copyrightForm = reactive({});

export function setOpenSetFrom<T, K extends keyof T>(key: K, value: any, object = openSetForm as T) {
  // eslint-disable-next-line no-param-reassign
  object[key] = value;
}
