import { ref, reactive } from 'vue';

const sendMessageSwitch = ref(true);

export const sendMess = () => {
  sendMessageSwitch.value = !sendMessageSwitch.value;
};

export const baseInfoForm = reactive({});

export const runParamsForm = reactive({});

export const openSetForm = reactive({});

export const codeTemplateForm = reactive({
  others: [],
});

export const heigherSetForm = reactive({
  others: [],
});

export const copyrightForm = reactive({});
