<template>
  <el-dialog
    title="关于"
    v-model="dialogVisible"
    width="40%"
    top="25vh"
    custom-class="dialog-about"
    @close="handleClose"
  >
    <div class="about__divider"></div>
    <div class="about__logo">
      <img src="./tcloud.png" />
      <div></div>
      <img src="./citybase.png" />
    </div>
    <div class="about__edition">版本 1.0.0</div>
    <div class="about__footer">
      Copyright @ 1998 - 2021 Tencent All Rights Reserved 腾讯公司 版权所有
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "AboutInfo",
  setup() {
    const router = useRouter();
    const dialogVisible = ref(true);
    const handleClose = () => {
      dialogVisible.value = false;
      router.push("/");
    };
    return {
      dialogVisible,
      handleClose,
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog-about {
  > .el-dialog__title {
    font-size: 16px;
    font-weight: bolder;
  }
}
.about__divider {
  height: 2px;
  background-color: #eee;
}
.about__logo {
  width: 350px;
  height: 80px;
  text-align: center;
  margin: 0 auto;
  > img,
  > div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  > img:first-child {
    left: 36%;
  }
  > img:last-child {
    left: 64%;
  }
  > div {
    display: inline-block;
    width: 2px;
    height: 28px;
    background-color: #eee;
  }
}
.about__edition {
  margin: 30px 0;
  font-size: 14px;
  font-weight: bolder;
  text-align: center;
}
.about__footer {
  text-align: center;
  font-size: 13px;
  color: #bbb;
}
</style>