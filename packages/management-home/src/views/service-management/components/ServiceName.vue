<template>
  <el-tooltip effect="dark" :visible-arrow="false" :content="name" placement="top">
    <span>{{ showName }}</span>
  </el-tooltip>
</template>
<script>
import { defineComponent, computed } from 'vue';
import { getServiceShowName } from './utils';
export default defineComponent({
  name: 'ServiceName',
  props: {
    name: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const showName = computed(() => getServiceShowName(props.name));
    return {
      showName,
    };
  },
});
</script>
