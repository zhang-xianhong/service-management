import { ref } from 'vue'

const linkto = ref('/')

export const getLink = () => linkto.value

export const setLink = (path: string) => {
  linkto.value = path
}
