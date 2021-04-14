<template>
  <el-select
    v-model="ownerIds"
    multiple
    filterable
    remote
    reserve-keyword
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    :loading="loading"
    @change="onChange"
    v-bind="$attrs"
  >
    <el-option v-for="(item, index) in owners" :key="index" :label="item.displayName" :value="item.id"> </el-option>
  </el-select>
</template>

<script lang="ts">
import { Ref, ref, SetupContext } from 'vue';
import { getOwnerList, getOwnerById } from './owners-util';

export default {
  name: 'OwnersSelect',
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props: { value: any }, ctx: SetupContext) {
    const ownerIds: Ref<number[]> = ref(props.value.map((item: { userId: number }) => item.userId));
    const owners: Ref<any[]> = ref([]);
    const loading: Ref<boolean> = ref(false);

    async function getOwners(keyword = '') {
      owners.value = await getOwnerList(keyword);
    }

    getOwners();

    function onChange(value: number[]) {
      const owners = value.map((id: number) => getOwnerById(id));
      ctx.emit('change', {
        ownerList: owners,
        owner: value.join(','),
        owners: owners.map((item: any) => ({ userId: item.id })),
        ownersName: owners.map((item: any) => item.displayName).join(','),
      });
    }

    async function remoteMethod(query: string) {
      if (query !== '') {
        loading.value = true;
        await getOwners(query);
        loading.value = false;
      } else {
        owners.value = [];
      }
    }

    return {
      ownerIds,
      owners,
      loading,
      onChange,
      remoteMethod,
    };
  },
};
</script>

<style scoped></style>
