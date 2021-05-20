<template>
  <div class="router-loading" v-loading="true"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
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
  },
});
</script>

<style lang="scss">
.router-loading {
  width: 100vw;
  height: 100vh;
}
</style>
