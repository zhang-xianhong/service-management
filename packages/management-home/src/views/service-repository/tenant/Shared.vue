<template>
  <div>
    <service-repository-list />
  </div>
</template>
<script>
import { defineComponent } from 'vue';
import ServiceRepositoryList from '../list/List.vue';
export default defineComponent({
  components: {
    ServiceRepositoryList,
  },
});
</script>
