<template>
  <div class="blank-header"></div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
export default defineComponent({
  name: 'BlankHeader',
  setup() {
    const clintWidth = ref(document.body.clientWidth);
    const layoutBool = ref(clintWidth.value > 1440);
    console.log(clintWidth.value, layoutBool.value);
    onMounted(() => {
      clintWidth.value = document.body.clientWidth;
      window.onresize = () => {
        clintWidth.value = document.body.clientWidth;
        // getElementsByClassName('layout-container')[0]
        layoutBool.value = ref(clintWidth.value > 1440);
      };
    });
    return {
      clintWidth,
      layoutBool,
    };
  },
});
</script>

<style lang="scss">
.blank-header {
  width: 100%;
  height: 40px;
  margin-bottom: 10px;
  background-color: white;
}
</style>
