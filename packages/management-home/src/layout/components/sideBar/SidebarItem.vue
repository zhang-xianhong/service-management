<template>
  <div class="main-menu" v-if="!item.props.hidden">
    <template v-if="hasOwnShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren)">
      <app-link v-if="onlyOneChild.value.meta" :to="resolvePath(onlyOneChild.value.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.value.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <item :icon="onlyOneChild.value.meta.icon||(item.meta&&item.meta.icon)"
                :title="onlyOneChild.value.meta.title" @click="logs(onlyOneChild.value)" />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template v-slot:title>
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import AppLink from '@/layout/components/sideBar/link.vue'
import Item from '@/layout/components/sideBar/item.vue'
import { isExternal } from '@/utils/validate'
import path from 'path'

export default defineComponent({
  name: 'SidebarItem',
  components: {
    AppLink,
    Item
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          props: {
            default: {
              hidden: false
            }
          },
          meta: {
            title: '',
            icon: ''
          }
        }
      }
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const onlyOneChild = reactive({ value: {} })

    const hasOwnShowingChild = (children = [], parent: any) => {
      const showChidren = children.filter(item => {
        if ((item as any).props.hidden) {
          return false
        } else {
          onlyOneChild.value = item
          return true
        }
      })

      if (showChidren.length === 1) {
        return true
      }

      if (showChidren.length === 0) {
        onlyOneChild.value = { ...parent, noShowingChildren: true }
        return true
      }
      console.log(true, 11111, onlyOneChild.value)
      return false
    }

    const resolvePath = (routePath: string | undefined) => {
      if (!routePath) {
        return '/'
      }
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(props.basePath)) {
        return props.basePath
      }
      const rpath = path.resolve(props.basePath, routePath)
      // console.log(props.basePath, routePath, rpath, '12222222222222')
      return rpath
    }

    const logs = (res: any) => {
      console.log(res, 'this is log')
      return res
    }

    console.log(props.item.meta, 'this is item propss')

    return {
      hasOwnShowingChild,
      resolvePath,
      onlyOneChild,
      logs
    }
  }
})
</script>

<style lang="scss">
.main-menu{
  background: rgba(255,255,255,0.2);
  width: 210px;
}
</style>
