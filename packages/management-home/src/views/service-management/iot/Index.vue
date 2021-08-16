<template>
  <div class="develop">
    <img :src="icon" alt="" />
    <h3>该功能正在开发中，尽请期待~</h3>
  </div>
</template>
<script>
import { defineComponent } from 'vue';
import icon from '@/assets/img/whitelist.svg';
export default defineComponent({
  setup() {
    return {
      icon,
    };
  },
});
</script>
<style lang="scss" scoped>
.develop {
  background-color: white;
  padding: 100px 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  img {
    width: 100%;
    height: 100%;
    max-width: 320px;
  }

  h3 {
    margin: 100px 50px 0 50px;
    font-size: 20px;
  }
}
</style>
