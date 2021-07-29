<template>
  <div class="no-right">
    <div class="no-right-item">
      <div class="item-img"></div>
      <div class="item-font">
        无访问权限，请联系管理员或<el-button type="text" @click="jump2dashboard">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'NoRight',
  setup() {
    const router = useRouter();
    const jump2dashboard = () => {
      router.push('/');
    };

    return {
      jump2dashboard,
    };
  },
});
</script>

<style lang="scss">
$image: url(~@/assets/img/403.png);
.no-right {
  width: 100vw;
  height: 100vh;
  text-align: center;
  position: relative;

  &-item {
    width: 680px;
    height: 500px;
    //background-color: rgba(0, 0, 0, 0.2);
    position: absolute;
    margin-left: -340px;
    margin-top: -250px;
    top: 50%;
    left: 50%;
    display: flex;
    flex-direction: column;

    .item-img {
      width: 680px;
      height: 400px;
      background: $image no-repeat #ffffff;
      background-size: 100% 100%;
    }
    .item-font,
    .el-button {
      font-size: 20px;
      font-weight: 600;
    }
  }
}
</style>
