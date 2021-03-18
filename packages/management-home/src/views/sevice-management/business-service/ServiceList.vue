<template>
  <div class="service-list">
    <div class="service-list_header">
      <div class="service-list_left">
        <el-button icon="el-icon-plus" type="primary" @click="toggleServiceDialog">新建</el-button>
        <el-button>克隆</el-button>
        <el-button>继承</el-button>
        <el-button>启动</el-button>
        <el-button>停止</el-button>
        <el-button>删除</el-button>
      </div>
      <div class="service-list_right">
        <el-input placeholder="请输入服务名称/标签/分类" style="width: 250px">
          <template #append>
            <el-button icon="el-icon-search"></el-button>
          </template>
        </el-input>
      </div>
    </div>
    <div class="service-list_content">
      <el-table :data="logs(serviceTableList.list)" style="margin-bottom: 20px">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column type="index" width="50" label="序号"> </el-table-column>
        <el-table-column property="name" label="服务名称"></el-table-column>
        <el-table-column property="description" label="服务描述"></el-table-column>
        <el-table-column property="people" label="负责人"></el-table-column>
        <el-table-column property="status" label="服务状态"></el-table-column>
        <el-table-column property="sort" label="分类"></el-table-column>
        <el-table-column property="tags" label="标签"></el-table-column>
        <el-table-column property="source" label="服务来源"></el-table-column>
        <el-table-column property="version" label="服务版本"></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1, 10, 15, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="serviceTableList.total"
      >
      </el-pagination>
    </div>

    <el-dialog title="新增服务" v-model="addServiceDialog" width="600px">
      <div class="add-service-set">
        <el-form :model="serviceDetail">
          <el-form-item label="服务名称" :label-width="labelWidth">
            <el-input v-model="serviceDetail.name"></el-input>
          </el-form-item>
          <el-form-item label="服务描述" :label-width="labelWidth">
            <el-input v-model="serviceDetail.description"></el-input>
          </el-form-item>
          <el-form-item label="负责人" :label-width="labelWidth">
            <el-select v-model="serviceDetail.person" placeholder="请选择活动区域">
              <el-option
                v-for="(item, index) in persons"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务分类" :label-width="labelWidth">
            <el-select v-model="serviceDetail.sort" placeholder="请选择活动区域">
              <el-option
                v-for="(item, index) in sorts"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务标签" :label-width="labelWidth">
            <el-select v-model="serviceDetail.tag" placeholder="请选择活动区域">
              <el-option v-for="(item, index) in tags" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务详情" :label-width="labelWidth">
            <el-input v-model="serviceDetail.details"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addServiceDialog = false">取 消</el-button>
          <el-button type="primary" @click="addServiceDialog = false">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { refreshServiceList, serviceTableList, serviceDetail, persons, tags, sorts } from './service-data-utils';

export default defineComponent({
  name: 'ServiceList',
  setup() {
    refreshServiceList();

    const addServiceDialog = ref(false);
    const toggleServiceDialog = () => {
      addServiceDialog.value = !addServiceDialog.value;
    };
    const labelWidth = ref('100px');

    const currentPage = ref(1);
    const pageSize = ref(10);
    const handleSizeChange = (res: number) => {
      pageSize.value = res;
      const data = {
        page: currentPage.value,
        pageSize: pageSize.value,
      };
      refreshServiceList(data);
    };
    const handleCurrentChange = (res: number) => {
      currentPage.value = res;
      const data = {
        page: currentPage.value,
        pageSize: pageSize.value,
      };
      refreshServiceList(data);
    };

    function logs(res) {
      return res;
    }
    return {
      serviceTableList,
      serviceDetail,
      persons,
      tags,
      sorts,
      logs,
      currentPage,
      handleSizeChange,
      handleCurrentChange,
      pageSize,
      addServiceDialog,
      labelWidth,
      toggleServiceDialog,
    };
  },
});
</script>

<style lang="scss">
.service-list {
  &_header {
    width: 100%;
    height: 40px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    display: flex;
    & > div {
      flex: 1;
    }
  }
  &_right {
    text-align: right;
  }
  &_content {
  }
}
.add-service-set {
  width: 400px;
  .el-input--small .el-input__inner {
    height: 32px;
    line-height: 32px;
    width: 400px;
  }
}
</style>
