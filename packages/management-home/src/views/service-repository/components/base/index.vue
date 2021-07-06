<template>
  <el-row :gutter="20">
    <el-col :span="12" v-for="item in baseInfo" :key="item.label">
      <el-row :gutter="20">
        <el-col :span="12"> {{ item.label }}</el-col>
        <el-col :span="12">{{ item.value }} </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { getRepositoryDetail } from '@/api/repository';

export default defineComponent({
  name: 'ServiceBase',
  props: {
    snapshotNo: {
      type: String,
      default: () => '',
    },
  },
  setup(props) {
    const baseInfo = reactive({
      serviceName: {
        label: '服务英文名',
        value: '',
      },
      serviceNameZh: {
        label: '服务中文名',
        value: '',
      },
      level: {
        label: '级别',
        value: '',
      },
      type: {
        label: '类型',
        value: '',
      },
      origin: {
        label: '来源',
        value: '',
      },
      developer: {
        label: '开发方',
        value: '',
      },
      platformShareType: {
        label: '权限',
        value: '',
      },
      serviceVersion: {
        label: '版本',
        value: '',
      },
      classification: {
        label: '分类',
        value: '',
      },
      tag: {
        label: '标签',
        value: '',
      },
    });
    const getDetail = async () => {
      try {
        const { snapshotNo } = props;
        const res = await getRepositoryDetail(snapshotNo);
        console.log('res', res);
      } catch (error) {
        console.log(error);
      }
    };
    getDetail();

    return { baseInfo };
  },
});
</script>
<style scoped></style>
