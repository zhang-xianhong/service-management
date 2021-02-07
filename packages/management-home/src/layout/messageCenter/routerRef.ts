import router from '@/router'
import { reactive } from 'vue'

const routerRef = reactive({ value: router })

export const getRouterRef = () => {
  return routerRef
}

export const setRouterRef = (res: any) => {
  routerRef.value = res
}

export const getComputedRoutes = () => {
  return routerRef.value.getRoutes().map(x => {
    // eslint-disable-next-line
    // @ts-ignore
    if (x.props.default.isRouteLevel) {
      return x
    }
  }).filter(x => x)
}
