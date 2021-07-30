<template>
  <div>
    <list-wrap :loading="loading" :inProject="false" :empty="apiList.length === 0" :hasCreateAuth="false">
      <el-table :data="apiList" style="width: 100%">
        <el-table-column label="序号" type="index"> </el-table-column>
        <el-table-column prop="name" label="接口名称"></el-table-column>
        <el-table-column prop="methodType" label="请求方式">
          <template #default="scope">
            {{ getMethodName(scope.row.methodType) }}
          </template>
        </el-table-column>
        <el-table-column prop="modelId" label="数据模型">
          <template #default="scope">
            {{ getModelName(scope.row.modelId) }}
          </template>
        </el-table-column>
        <el-table-column prop="url" label="URL"> </el-table-column>
        <el-table-column prop="description" label="接口描述"> </el-table-column>
      </el-table>
    </list-wrap>
  </div>
</template>
<script lang="ts">
import { defineComponent, watch, ref } from 'vue';
const METHOD_TYPES: string[] = ['GET', 'POST', 'PUT', 'DELETE'];
export default defineComponent({
  name: 'ServiceApi',
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const apiList = ref([] as any);
    const models = ref([] as any);
    const getModelName = (modelId: number) => {
      const model = models.value.find((item: any) => item.id === modelId);
      return model?.name || '';
    };
    const getMethodName = (method: number) => METHOD_TYPES[method] || '';

    const parseApiList = (info: any) => {
      try {
        apiList.value = JSON.parse(info.snapshotInfo.config || '{}').serviceApis.map((item: any) => item);
        models.value = JSON.parse(info.snapshotInfo.config || '{}').modelInfos.map((item: any) => item);
      } catch (e) {
        apiList.value = [];
      }
    };

    if (props.info) {
      parseApiList(props.info);
    }

    watch(
      () => props.info,
      (newValue) => {
        parseApiList(newValue);
      },
    );
    return {
      apiList,
      getModelName,
      getMethodName,
    };
  },
});
</script>
<style lang="scss" scoped></style>
