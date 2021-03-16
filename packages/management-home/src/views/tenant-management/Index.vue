<template>
  <div class="tenant">
    <div class="tenant-head">
      <div class="tenant-head_left">
        <el-button icon="el-icon-plus" type="primary">新建</el-button>
        <el-button>冻结</el-button>
        <el-button>删除</el-button>
      </div>
      <div class="tenant-head_right">
        <el-input placeholder="请输入企业名称" style="width: 250px">
          <template #append>
            <el-button icon="el-icon-search"></el-button>
          </template>
        </el-input>
      </div>
    </div>
    <div class="tenant-content">
      <el-table :data="listData.list">
        <el-table-column property="name" label="项目名称"></el-table-column>
        <el-table-column property="person" label="负责人"></el-table-column>
        <el-table-column property="tel" label="联系电话"></el-table-column>
        <el-table-column property="email" label="电子邮箱"></el-table-column>
        <el-table-column property="manager" label="管理员"></el-table-column>
        <el-table-column property="managerTel" label="管理员电话"></el-table-column>
        <el-table-column property="status" label="状态"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { getTenantListForTable } from '@/views/tenant-management/tenant-serve-tools/tenant-data-utils';

export default defineComponent({
  name: 'Tenant',
  setup() {
    const listData = ref({} as any);
    function refreshTable() {
      getTenantListForTable().then((res) => {
        listData.value = res.data;
        console.log(listData.value);
      });
    }
    refreshTable();
    return {
      listData,
    };
  },
});
</script>

<style lang="scss">
.tenant {
  &-head {
    width: 100%;
    height: 40px;
    line-height: 40px;
    display: flex;
    margin-bottom: 10px;
    & > div {
      flex: 1;
    }
    &_right {
      text-align: right;
    }
  }
}
</style>
