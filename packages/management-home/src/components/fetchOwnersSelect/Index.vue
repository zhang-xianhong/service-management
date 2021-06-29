<template>
  <el-select
    v-model="value"
    multiple
    filterable
    remote
    reserve-keyword
    multiple-limit="10"
    placeholder="请输入负责人姓名或者拼音"
    :remote-method="remoteMethod"
    :loading="loading"
    @change="changeOwners"
    clearable
  >
    <el-option v-for="item in options" :key="item.id" :label="item.displayName" :value="item.id"> </el-option>
  </el-select>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { queryInTenant } from '@/api/tenant';

export default defineComponent({
  name: 'fetchOwnersSelect',
  props: {
    useProject: {
      type: Boolean,
      default: () => false,
    },
  },
  setup(props, ctx) {
    const value = ref('' as any);
    const loading = ref(false);
    const options = ref([]);
    const remoteMethod = (keyword: string) => {
      const projectId = localStorage.getItem('projectId');
      const payload = props.useProject ? { keyword, projectId } : { keyword };
      queryInTenant(payload).then((res) => {
        // const { users } = res.data || { users: [] };
        options.value = res.data || [];
      });
    };
    remoteMethod('');
    const changeOwners = (res: any) => {
      ctx.emit('get-owners', res.join(','));
    };
    return {
      value,
      remoteMethod,
      loading,
      options,
      changeOwners,
    };
  },
});
</script>

<style lang="scss"></style>
