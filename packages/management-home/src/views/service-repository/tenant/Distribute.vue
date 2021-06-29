<template>
  <service-repository-list list-type="distribute" />
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
