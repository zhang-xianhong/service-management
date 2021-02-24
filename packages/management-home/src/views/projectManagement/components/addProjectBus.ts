import { ref, reactive } from 'vue'

const sendMessageSwitch = ref(true)

export const sendMess = () => {
  sendMessageSwitch.value = !sendMessageSwitch.value
}

export const baseInfoForm = reactive({})

export const runParamsForm = reactive({})

export const openSetForm = reactive({})

export const codeTemplateForm = reactive({})

export const heigherSetForm = reactive({})

export const copyrightForm = reactive({})
