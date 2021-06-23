<template>
  <el-select
    v-model="ownerIds"
    multiple
    filterable
    remote
    reserve-keyword
    multiple-limit="10"
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    :loading="loading"
    @change="onChange"
    v-bind="$attrs"
    clearable
  >
    <el-option v-for="item in owners" :key="item.id" :label="item.displayName" :value="item.id"> </el-option>
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
    options: {
      type: Array,
      default: () => [],
    },
    useProject: {
      type: Boolean,
      default: () => false,
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props: { value: Array<any>; options: Array<any>; useProject: boolean }, ctx: SetupContext) {
    const ownerIds: Ref<number[]> = ref(props.value.map((item: { userId: number }) => item.userId));
    const owners: Ref<any[]> = ref(props.options);
    const loading: Ref<boolean> = ref(false);

    async function getOwners(keyword = '') {
      owners.value = await getOwnerList(keyword || ' ', owners.value, props.useProject);
      console.log(owners.value);
    }

    getOwners();

    function onChange(value: number[]) {
      const ownerData = value.map((id: number) => getOwnerById(id));
      ctx.emit('change', {
        ownerUsers: ownerData,
        owner: value.join(','),
        owners: ownerData.map((item: any) => ({ userId: item.id })),
        ownersName: ownerData.map((item: any) => item.displayName).join(','),
      });
    }

    async function remoteMethod(query: string) {
      loading.value = true;
      await getOwners(query);
      loading.value = false;
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
