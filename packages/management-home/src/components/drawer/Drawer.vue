<template>
  <el-drawer v-model="drawer" size="20%" :with-header="false" :modal="true">
    <div class="drawer">
      <div class="drawer__title">{{ drawerTitle }}</div>
      <div class="drawer__content">
        <!-- 抽屉中间插入内容 -->
        <div class="drawer__content-slot">
          <slot name="drawer__content-slot"></slot>
        </div>
      </div>
      <div class="drawer__btns">
        <slot name="drawer__footer-slot"></slot>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import { ref, defineComponent } from 'vue';
export default defineComponent({
  name: 'drawer',
  props: {
    title: String,
  },
  setup(props) {
    const drawer = ref(false);
    const openDrawer = () => {
      drawer.value = !drawer.value;
    };
    const closeDrawer = () => {
      drawer.value = false;
    };

    return {
      drawerTitle: props.title,
      drawer,
      openDrawer,
      closeDrawer,
    };
  },
});
</script>
<style lang="scss">
.el-drawer {
  outline: 0;
}
</style>
<style lang="scss" scoped>
.drawer {
  display: flex;
  flex-direction: column;
  height: 100%;
  &__title {
    font-family: '微软雅黑 Bold', '微软雅黑', sans-serif;
    font-weight: 700;
    font-style: normal;
    font-size: 14px;
    color: #000000;
    padding: 20px;
    text-align: center;
  }
  &__content {
    flex: 1;
    padding: 0 20px;
    overflow: auto;
  }
  &__btns {
    display: flex;
    padding: 0 20px;
    margin-bottom: 20px;
    button {
      flex: 1;
    }
  }
}
</style>
