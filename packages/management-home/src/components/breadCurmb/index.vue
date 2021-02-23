<template>
  <div class="bread-curmb">
    <el-breadcrumb class="app-breadcrumb" separator="/">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
          <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect breadcrumb-item">{{ item.meta.title }}</span>
          <a class="breadcrumb-item" v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, watch, ref } from 'vue'
import pathToRegexp from 'path-to-regexp'

export default defineComponent({
  name: 'breadCurmb',
  setup () {
    const levelList = ref([])
    const handleLink = (item: any) => {
      console.log(item)
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const proxy = getCurrentInstance().proxy as any
    const getBread = () => {
      const matched = proxy.$route.matched.filter((item: any) => item.meta && item.meta.title)
      levelList.value = matched.filter((item: any) => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    }
    const watchRoute = watch(() => proxy.$route, route => {
      if (route.path.startsWith('/redirect/')) {
        return false
      }
      getBread()
    })
    getBread()
    return {
      levelList,
      handleLink
    }
  }
})
</script>

<style lang="scss">
@import './src/styles/layout';

.bread-curmb{
  // 面包屑字体颜色控制
  //.el-breadcrumb__inner{
  //  color: $breadCurmbColor !important;
  //  &>a{
  //    color: $breadCurmbColor !important;
  //  }
  //}
}
.breadcrumb-item {
  color: $deepColor !important
}
</style>
