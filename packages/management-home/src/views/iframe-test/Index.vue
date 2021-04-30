<template>
  <div class="test-iframe">
    <el-input :value="urls" style="width: 400px; margin-bottom: 20px; margin-right: 20px" v-model="urls"></el-input>
    <el-button type="primary" @click="goSrc" @keyup.enter="goSrc">前往</el-button>
    <el-button @click="sendMessage">Send Token</el-button>
    <br />
    <iframe :src="src" ref="iframesTest"></iframe>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { getToken } from '@/utils/todoToken';
import { userInfo } from '@/layout/messageCenter/user-info';

export default defineComponent({
  name: 'IframeTest',
  setup() {
    const urls = ref('http://dev.sa.qq.com:1026/');
    const src = ref('http://dev.sa.qq.com:1026/');
    const iframesTest = ref({} as any);
    const goSrc = () => {
      src.value = urls.value;
    };
    const sendMessage = () => {
      const data = {
        token: getToken() || '',
        userInfo: { ...userInfo.value },
        headers: localStorage.getItem('HEADERS'),
      };
      delete data.userInfo.roleIds;
      iframesTest.value.contentWindow.postMessage({ data }, '*');
    };
    return {
      urls,
      goSrc,
      src,
      sendMessage,
      iframesTest,
    };
  },
});
</script>

<style lang="scss">
.test-iframe {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: 20px;
  iframe {
    width: 100%;
    height: 600px;
  }
}
</style>
