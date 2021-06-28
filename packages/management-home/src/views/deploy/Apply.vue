<template>
  <div>
    <el-row>
      <el-col :span="6" style="text-align: left">
        <el-button icon="el-icon-plus" type="primary" style="width: 90px" @click="openCreateDialog"> 新建 </el-button>
      </el-col>
      <el-col :offset="12" :span="6" style="text-align: right">
        <el-input suffix-icon="el-icon-search" placeholder="请输入服务名称"></el-input>
      </el-col>
    </el-row>
    <list-wrap :loading="loading" :empty="total === 0" :hasCreateAuth="getShowBool('add')">
      <el-table :data="tableData">
        <el-table-column type="expand">
          <template #default="props">
            <el-form label-position="left">
              <el-form-item label="申请说明">
                <span>{{ props.row.description }}</span>
              </el-form-item>
              <el-form-item label="审核说明">
                <span>{{ props.row.auditInstructions }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index" width="50"> </el-table-column>
        <el-table-column label="发布类型" width="80" prop="moduleType"></el-table-column>
        <el-table-column label="发布名称" prop="publishName">
          <template #default="props">{{ props.row.name }}</template>
        </el-table-column>
        <el-table-column label="版本" width="60" prop="version"></el-table-column>
        <el-table-column label="申请人" width="80" prop="applyUser">
          <template #default="props">{{ props.row.applyUser }}</template>
        </el-table-column>
        <el-table-column label="申请时间" width="160" prop="createTime">
          <template #default="scope">{{ dateFormat(scope.row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="审核人" width="80">
          <template #default="props">{{ props.row.reviewUser }}</template>
        </el-table-column>
        <el-table-column label="审核结果" width="80" prop="reviewResult"> </el-table-column>
        <el-table-column label="审核时间">
          <template #default="scope">{{ dateFormat(scope.row.reviewTime) }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <!--          <template>-->
          <!--            <el-button type="text" size="mini">编辑</el-button>-->
          <!--            <el-button type="text" size="mini">删除</el-button>-->
          <!--          </template>-->
        </el-table-column>
      </el-table>
      <packaged-pagination
        v-if="total"
        :current-page="searchProps.page"
        :page-size="searchProps.pageSize"
        :page-sizes="[10, 20, 50]"
        layout="sizes, prev, pager, next, jumper"
        @size-change="handlePageSizeChange"
        @current-change="handlePageNumChange"
      >
      </packaged-pagination>
    </list-wrap>
    <el-dialog title="发布服务" v-model="createDialogVisible" width="500px">
      <el-form :model="serviceInfo" label-width="120px" label-position="left" ref="deployForm">
        <el-form-item label="发布类型" required="true">
          <el-select placeholder="请选择发布类型">
            <el-option label="服务" value="service"></el-option>
            <el-option label="应用" value="application"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务名称" required="true">
          <el-select placeholder="请选择服务名称">
            <el-option label="data1" value="data1"></el-option>
            <el-option label="data2" value="data2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请账号"></el-form-item>
        <el-form-item label="发布版本" required="true">
          <el-select placeholder="请选择发布版本">
            <el-option label="v1.0" value="1"></el-option>
            <el-option label="v2.0" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            label="发布说明"
            type="textarea"
            :rows="3"
            placeholder="请输入发布说明，小于512字"
            maxlength="512"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import {
  DeployTableItemStruct,
  // AUDIT_RESULTS,
  getModuleType,
  getReviewResult,
  // STATUS
} from '@/views/deploy/index';

import { ElMessage } from 'element-plus';
import dateFormat from '@/utils/date-format';
import { getDeployList } from '@/api/deploy';
import PackagedPagination from '@/components/pagination/Index.vue';
import ListWrap from '@/components/list-wrap/Index.vue';
import { getShowBool } from '@/utils/permission-show-module';

interface TableState {
  tableData: Array<DeployTableItemStruct>;
  loading: boolean;
  total: number;
  createDialogVisible: boolean;
  serviceInfo: {
    type: string;
    name: string;
    account: string;
    version: string;
    description: string;
  };
  searchProps: {
    keyword: string;
    page: number;
    pageSize: number;
    sortField: string;
    sortType: 'ascending' | 'descending';
  };
}

export default defineComponent({
  components: { ListWrap, PackagedPagination },
  setup() {
    const tableState: TableState = reactive({
      tableData: [],
      loading: false,
      total: 0,
      statusFilters: [],
      auditResultsFilters: [],
      applicantFilters: [],
      reviewerFilters: [],
      createDialogVisible: false,
      serviceInfo: {
        type: '',
        name: '',
        account: '',
        version: '',
        description: '',
      },
      searchProps: {
        keyword: '',
        status: null,
        auditResults: null,
        page: 1,
        pageSize: 10,
        sortField: 'createTime',
        sortType: 'descending',
      },
    });
    async function getTableData() {
      try {
        tableState.loading = true;
        const { data } = await getDeployList(tableState.searchProps);
        tableState.loading = false;
        const { count, rows = [] } = data;
        tableState.total = count;
        tableState.tableData = rows.map((item: any) => ({
          ...item,
          moduleType: getModuleType(item.type),
          reviewResult: getReviewResult(item.result),
        }));
      } catch (error) {
        tableState.loading = false;
        ElMessage({
          type: 'error',
          message: '获取申请列表失败',
        });
      }
    }
    getTableData();

    const handlePageSizeChange = (pageSize: number) => {
      tableState.searchProps.pageSize = pageSize;
      getTableData();
    };
    const handlePageNumChange = (page: number) => {
      tableState.searchProps.page = page;
      getTableData();
    };

    // 新建表单
    const openCreateDialog = () => {
      tableState.createDialogVisible = true;
    };
    return {
      ...toRefs(tableState),
      dateFormat,
      handlePageSizeChange,
      handlePageNumChange,
      getShowBool,
      openCreateDialog,
    };
  },
});
</script>
