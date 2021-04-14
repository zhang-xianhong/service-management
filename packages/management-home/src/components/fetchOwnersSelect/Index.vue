<template>
  <el-select
    v-model="value"
    multiple
    filterable
    remote
    reserve-keyword
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
  setup(props, ctx) {
    const value = ref('' as any);
    const loading = ref(false);
    const options = ref([]);
    const remoteMethod = (keyword: string) => {
      queryInTenant({ keyword }).then((res) => {
        console.log(res, 'this is owners');
        const { users } = res.data || { users: [] };
        options.value = users;
      });
    };
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
