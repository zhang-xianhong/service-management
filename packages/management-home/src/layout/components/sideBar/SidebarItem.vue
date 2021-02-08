<template>
  <div class="main-menu" v-if="!item.props.hidden">
    <template v-if="hasOwnShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren)">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)"
                :title="onlyOneChild.meta.title" />
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
import { defineComponent, onMounted, reactive } from 'vue'
import { getComputedRoutes } from '@/layout/messageCenter/routerRef'
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
    onMounted(() => {
      const luts = getComputedRoutes()
      console.log(Object.keys(luts), luts)
    })

    const onlyOneChild = reactive({ value: {} })

    const hasOwnShowingChild = (children = [], parent: any) => {
      const showChidren = children.filter(item => {
        console.log(item, 'item')
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
        onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    }

    const resolvePath = (routePath: string) => {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(props.basePath)) {
        return props.basePath
      }
      return path.resolve(props.basePath, routePath)
    }

    return {
      hasOwnShowingChild,
      resolvePath,
      onlyOneChild
    }
  }
})
</script>

<style lang="scss">
.main-menu{
  background: rgba(255,255,255,0.2);
}
</style>
