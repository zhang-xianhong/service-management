<template>
  <div class="blank-header">
    <span class="blank-header-back" @click="jumpBack" v-if="back"><i class="el-icon-back"></i></span>
    <span class="blank-header-title" :style="{ marginLeft: back ? '0' : '20px' }">{{ title }}</span>
    <span v-if="detailName" class="blank-header-detail">|</span>
    <span class="blank-header-detail">{{ detailName }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'BlankHeader',
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
    const route = useRoute();
    const title = ref('' as any);
    const back = ref(false);
    const detailName = ref('' as any);
    const proxy = (getCurrentInstance() as any).proxy as any;
    const getBread = () => {
      title.value = route.meta.title || '';
      back.value = route.path.includes('detail');
      detailName.value = route.query.detailName;
    };
    getBread();

    function jumpBack() {
      proxy.$router.back();
    }
    watch(
      () => proxy.$route,
      (route) => {
        if (route.path.startsWith('/redirect/')) {
          return false;
        }
        getBread();
      },
    );
    function logs(res: any) {
      console.log(res);
      return res;
    }
    return {
      clintWidth,
      layoutBool,
      title,
      jumpBack,
      detailName,
      back,
      logs,
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
    color: #006eff;
    &:hover {
      transform: scale(1.5);
    }
  }
  &-detail {
    display: inline-block;
    margin-left: 10px;
  }
}
</style>
