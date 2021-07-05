<template>
  <div>
    <service-depend />
  </div>
</template>
<script>
import { defineComponent } from 'vue';
import ServiceDepend from './components/depend/Index.vue';
export default defineComponent({
  components: {
    ServiceDepend,
  },
});
</script>
