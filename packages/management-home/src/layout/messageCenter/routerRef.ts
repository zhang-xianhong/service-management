import router from '@/router'
import { reactive } from 'vue'
import { Router } from "vue-router";

const routerRef = reactive({value: router})

export const getRouterRef = () => {
  return routerRef.value.getRoutes()
}

export const setRouterRef = (res: any) => {
  routerRef.value = res
}
