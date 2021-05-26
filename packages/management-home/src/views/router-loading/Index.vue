<template>
  <div class="router-loading" v-loading="true"></div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount } from 'vue';
import { routerLoading } from '@/layout/messageCenter/routerRef';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  name: 'RouterLoading',
  setup() {
    const router = useRouter();
    const route = useRoute();
    if (!routerLoading.value) {
      router.push(route.redirectedFrom?.path || '/');
    }

    let timeout: any = setInterval(() => {
      window.location.reload();
    }, 3000);

    onBeforeUnmount(() => {
      clearInterval(timeout);
      timeout = null;
    });
  },
});
</script>

<style lang="scss">
.router-loading {
  width: 100vw;
  height: 100vh;
}
</style>
