<template>
  <div class="iframe-div">
    <iframe :src="src"></iframe>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { userCurrentProject } from '@/layout/messageCenter/user-info';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'IframeDiv',
  props: {
    appId: {
      type: String,
      default: () => '',
    },
  },
  setup() {
    const baseUrl = '/app-editor';
    const route = useRoute();
    const { query } = route;
    const src = ref(`${baseUrl}/?appId=${query.appId}&projectId=${userCurrentProject.value.id}`);
    return {
      src,
    };
  },
});
</script>

<style lang="scss">
.iframe-div {
  width: 100%;
  height: calc(100vh - 150px);
  iframe {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    border: none;
  }
}
</style>
