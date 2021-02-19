import { ref, computed } from 'vue'

const linkto = ref('/')

export const getLink = computed(() => {
  linkto.value = localStorage.getItem('linkPath') || '/home'
  return linkto.value
})

export const setLink = (path: string) => {
  localStorage.setItem('linkPath', path)
  linkto.value = path
}

// 退出登录时，要记得消除此缓存
export const removeLink = () => {
  localStorage.removeItem('linkPath')
}
