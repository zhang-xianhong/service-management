<template>
  <div class="blank-header">
    <slot></slot>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
export default defineComponent({
  name: 'BlankHeader',
  setup() {
    const clintWidth = ref(document.getElementsByClassName('layout-container')[0].clientWidth);
    console.log(clintWidth.value);

    onMounted(() => {
      window.onresize = (res) => {
        console.log(res);
      };
    });
    return {
      clintWidth,
    };
  },
});
</script>

<style scoped></style>
