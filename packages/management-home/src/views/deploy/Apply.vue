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
                <span>{{ props.row.publishContent }}</span>
              </el-form-item>
              <el-form-item label="审核说明">
                <span>{{ props.row.reviewContent }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index" width="50"> </el-table-column>
        <el-table-column label="发布类型" width="80" prop="moduleType"></el-table-column>
        <el-table-column label="发布名称" prop="publishName">
          <template #default="props">{{ props.row.name }}</template>
        </el-table-column>
        <el-table-column label="版本" width="80" prop="version"></el-table-column>
        <el-table-column label="申请人" width="100">
          <template #default="props">{{ props.row.publisher }}</template>
        </el-table-column>
        <el-table-column label="申请时间" width="180" prop="applyTime">
          <template #default="scope">{{ dateFormat(scope.row.applyTime) }}</template>
        </el-table-column>
        <el-table-column label="审核人" width="100">
          <template #default="props">{{ props.row.reviewer }}</template>
        </el-table-column>
        <el-table-column label="审核结果" width="80" prop="reviewResult"> </el-table-column>
        <el-table-column label="审核时间" width="180">
          <template #default="scope">{{ dateFormat(scope.row.reviewTime) }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="props">
            <el-button type="text" size="mini" @click="updateReleaseInfo(props.row)">编辑</el-button>
            <el-button type="text" @click="removeApply">删除</el-button>
          </template>
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
    <service-info
      :visable="createDialogVisible"
      :releaseForms="releaseForm"
      :tableDatas="tableData"
      @close="closeReleaseForm"
      @getTableInfo="getTableData"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from 'vue';
import ServiceInfo from './ServiceInfo.vue';
import {
  DeployTableItemStruct,
  // AUDIT_RESULTS,
  getModuleType,
  getReviewResult,
  // STATUS
} from '@/views/deploy/index';

import { ElMessage, ElMessageBox } from 'element-plus';
import dateFormat from '@/utils/date-format';
import { deleteApply, getDeployList } from '@/api/deploy/deploy-apply';
import PackagedPagination from '@/components/pagination/Index.vue';
import ListWrap from '@/components/list-wrap/Index.vue';
import { getShowBool } from '@/utils/permission-show-module';

interface TableState {
  tableData: Array<DeployTableItemStruct>;
  loading: boolean;
  total: number;
  createDialogVisible: boolean;
  searchProps: {
    keyword: string;
    page: number;
    pageSize: number;
    sortField: string;
    sortType: 'ascending' | 'descending';
  };
}

interface ReleaseState {
  disabled: boolean;
  isEdit: boolean;
  id: string;
  serviceList: Array<object>;
  applicationList: Array<object>;
  versionOptions: Array<object>;
  types: Array<object>;
  serviceInfo: {
    releaseType: string;
    // type: number;
    name: string;
    account: string;
    version: string;
    description: string;
  };
}

export default defineComponent({
  components: { ListWrap, PackagedPagination, ServiceInfo },
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
      searchProps: {
        keyword: '',
        status: null,
        auditResults: null,
        page: 1,
        pageSize: 10,
        sortField: 'applyTime',
        sortType: 'descending',
      },
    });

    const releaseForm: ReleaseState = reactive({
      disabled: false,
      isEdit: false,
      id: '',
      serviceInfo: {
        releaseType: '',
        name: '',
        account: 'test',
        version: '',
        description: '',
      },
      serviceList: [
        { id: 1, name: '服务1' },
        { id: 2, name: '服务2' },
      ],
      applicationList: [],
      versionOptions: [
        { id: 1, name: '1.0' },
        { id: 2, name: '2.0' },
      ],
      types: [
        { id: 1, name: '服务' },
        { id: 2, name: '应用' },
      ],
    });

    const releaseInfo = ref({} as any);
    console.log(releaseInfo);

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
          reviewResult: getReviewResult(item.status),
        }));
        // console.log('tableState.tableData: ', tableState.tableData);
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

    function initReleaseForm() {
      releaseForm.disabled = false;
      releaseForm.isEdit = false;
      releaseForm.id = '';
      releaseForm.serviceInfo = {
        releaseType: '',
        // releaseType: getModuleType(tableState.tableData[0].type),
        name: '',
        account: 'test',
        version: '',
        description: '',
      };
    }

    // 删除发布申请
    const removeApply = async (rowData: any) => {
      ElMessageBox.confirm('是否确定删除该申请？', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const { code } = await deleteApply(rowData.id);
        if (code === 0) {
          return ElMessage.success('删除成功');
        }
        getTableData();
      });
    };

    // 新建表单
    const openCreateDialog = () => {
      tableState.createDialogVisible = !tableState.createDialogVisible;
    };

    // 关闭对话框
    const closeReleaseForm = () => {
      initReleaseForm();
      openCreateDialog();
    };

    // 编辑
    const updateReleaseInfo = (rowData: any) => {
      releaseForm.isEdit = true;
      releaseForm.id = rowData.id;
      releaseForm.serviceInfo.name = rowData.name;
      releaseForm.serviceInfo.releaseType = rowData.moduleType;
      releaseForm.serviceInfo.version = rowData.version;
      releaseForm.serviceInfo.description = rowData.description;
      openCreateDialog();
    };

    return {
      ...toRefs(tableState),
      dateFormat,
      handlePageSizeChange,
      handlePageNumChange,
      getShowBool,
      openCreateDialog,
      getTableData,
      releaseForm,
      closeReleaseForm,
      removeApply,
      updateReleaseInfo,
    };
  },
});
</script>
