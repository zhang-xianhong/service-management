<template>
  <div class="detail-base">
    <el-row :gutter="20" class="columns-wrap">
      <el-col :span="12" v-for="col in columns" :key="col.key">
        <el-row :gutter="20">
          <el-col :span="4" style="text-align: right">
            <span style="color: #606266">{{ col.label }}</span></el-col
          >
          <el-col :span="18" :offset="1">
            <service-name :name="info.serviceName" v-if="col.key === 'serviceName'" />
            <template v-else>{{ col.render() }} </template>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import { defineComponent, watch, ref } from 'vue';
import { SERVICE_LEVEL, getSharedType } from '../list/config';
import { getClassificationName, getTagsName } from '../util';
import { getAllTags } from '@/api/settings/tags';
import { getClassificationList } from '@/api/settings/classification';
import { userInfo } from '@/layout/messageCenter/user-info';
interface Column {
  key: string;
  label: string;
  render?: Function;
}

export default defineComponent({
  name: 'ServiceBase',
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
    const newColumns = ref([] as any);
    const tagList = ref([] as any);
    const classificationList = ref([] as any);
    const fetchData = async () => {
      const [tagReq, classificationReq] = await Promise.all([getAllTags(), getClassificationList()]);
      tagList.value = tagReq.data;
      classificationList.value = classificationReq.data;
    };

    fetchData();

    const columns: Column[] = [
      {
        key: 'serviceName',
        label: '服务英文名',
      },
      {
        key: 'serviceNameZh',
        label: '服务中文名',
        render(col: Column, row: any) {
          return row.snapshotInfo.serviceNameZh;
        },
      },
      {
        key: 'snapshotInfo.level',
        label: '级别',
        render(col: Column, row: any) {
          return SERVICE_LEVEL[row.snapshotInfo.level];
        },
      },
      {
        key: 'type',
        label: '类型',
        render() {
          return '业务服务';
        },
      },
      {
        key: 'origin',
        label: '来源',
        render(col: Column, row: any) {
          return row.tenantId === userInfo.value.tenantId ? '自研新建' : '平台共享';
        },
      },
      {
        key: 'developer',
        label: '开发方',
        render(col: Column, row: any) {
          return row.snapshotInfo.developer;
        },
      },
      {
        key: 'platformShareType',
        label: '权限',
        render(col: Column, row: any) {
          return getSharedType(row.platformShareType);
        },
      },
      {
        key: 'serviceVersion',
        label: '版本',
      },
      {
        key: 'classification',
        label: '分类',
        render(col: Column, row: any) {
          return getClassificationName(row.snapshotInfo.classification, classificationList.value);
        },
      },
      {
        key: 'tag',
        label: '标签',
        render(col: Column, row: any) {
          return getTagsName((row.snapshotInfo.tag || '').split(','), tagList.value);
        },
      },
    ];

    const setColumns = (info: any) => {
      newColumns.value = columns.map((item) => {
        const column = item;
        const { render } = column;
        column.render = () => render?.(column, info) || info[column.key];
        return column;
      });
    };

    if (props.info) {
      setColumns(props.info);
    }

    watch(
      () => props.info,
      (newValue) => {
        setColumns(newValue);
      },
    );
    return {
      columns: newColumns,
      getClassificationName,
      getTagsName,
      tagList,
      classificationList,
      userInfo,
    };
  },
});
</script>
<style lang="scss" scoped>
.detail-base {
  padding: 20px;
  .columns-wrap {
    margin-bottom: 0;
    min-height: 200px;
  }
}
</style>
