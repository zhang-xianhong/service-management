<template>
  <div class="blank-header">
    <span class="blank-header-back" v-if="back"><i class="el-icon-back"></i></span>
    <span class="blank-header-title">{{ title }}</span>
    <span></span>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onMounted, ref, watch } from 'vue';
export default defineComponent({
  name: 'BlankHeader',
  props: {
    back: {
      type: Boolean,
      default: () => !false,
    },
  },
  setup() {
    const clintWidth = ref(document.body.clientWidth);
    const layoutBool = ref(clintWidth.value > 1440);
    onMounted(() => {
      clintWidth.value = document.body.clientWidth;
      window.onresize = () => {
        clintWidth.value = document.body.clientWidth;
        // getElementsByClassName('layout-container')[0]
        layoutBool.value = clintWidth.value > 1440;
      };
    });
    const levelList = ref([]);
    const title = ref('');
    const proxy = (getCurrentInstance() as any).proxy as any;
    const getBread = () => {
      const matched = proxy.$route.matched.filter((item: any) => item.meta && item.meta.title);
      levelList.value = matched.filter((item: any) => item.meta && item.meta.title && item.meta.breadcrumb !== false);
      title.value = levelList.value.reverse()[0].meta.title || '';
    };
    getBread();
    console.log(levelList.value, 123);
    watch(
      () => proxy.$route,
      (route) => {
        if (route.path.startsWith('/redirect/')) {
          return false;
        }
        getBread();
      },
    );
    return {
      clintWidth,
      layoutBool,
      title,
    };
  },
});
</script>

<style lang="scss">
.blank-header {
  width: 100%;
  height: 40px;
  line-height: 40px;
  margin-bottom: 10px;
  background-color: white;
  &-back {
    display: inline-block;
    width: 60px;
    text-align: center;
    font-size: 18px;
  }
}
</style>
