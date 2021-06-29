<template>
  <div>
    <el-row>
      <el-col :offset="18" :span="6" style="text-align: right">
        <el-input suffix-icon="el-icon-search" placeholder="请输入服务名称"></el-input>
      </el-col>
    </el-row>
    <list-wrap :loading="loading" :empty="total === 0" :hasCreateAuth="getShowBool('add')">
      <el-table :data="tableData">
        <el-table-column type="expand">
          <template #default="props">
            <el-form label-position="left">
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
        <el-table-column label="申请人" width="100" prop="applyUser">
          <template #default="props">{{ props.row.publisher }}</template>
        </el-table-column>
        <el-table-column label="申请时间" width="180" prop="applyTime">
          <template #default="scope">{{ dateFormat(scope.row.applyTime) }}</template>
        </el-table-column>
        <el-table-column label="审核人" width="100">
          <template #default="props">{{ props.row.reviewer }}</template>
        </el-table-column>
        <el-table-column label="审核结果" width="80" prop="reviewResult">
          <template #default="props">{{ isReviewed(props.row) ? props.row.reviewResult : '' }}</template>
        </el-table-column>
        <el-table-column label="审核时间" width="180">
          <template #default="scope">{{ isReviewed(scope.row) ? dateFormat(scope.row.reviewTime) : '' }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="props">
            <el-button type="text" size="mini" :disabled="isReviewed(props.row)">审核</el-button>
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
  </div>
</template>

<script lang="ts">
import { getModuleType, getReviewResult, ReviewTableItemStruct } from '@/views/deploy/index';
import { defineComponent, reactive, toRefs } from 'vue';
import ListWrap from '@/components/list-wrap/Index.vue';
import PackagedPagination from '@/components/pagination/Index.vue';
import { ElMessage } from 'element-plus';
import { getReviewList } from '@/api/deploy/deploy-review';
import dateFormat from '@/utils/date-format';
import { getShowBool } from '@/utils/permission-show-module';

interface TableState {
  tableData: Array<ReviewTableItemStruct>;
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
    async function getTableData() {
      try {
        tableState.loading = true;
        const { data } = await getReviewList(tableState.searchProps);
        tableState.loading = false;
        const { count, rows = [] } = data;
        tableState.total = count;
        tableState.tableData = rows.map((item: any) => ({
          ...item,
          moduleType: getModuleType(item.type),
          reviewResult: getReviewResult(item.status),
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

    const isReviewed = (row: any) => row.reviewResult;

    return {
      ...toRefs(tableState),
      dateFormat,
      handlePageSizeChange,
      handlePageNumChange,
      getShowBool,
      isReviewed,
    };
  },
});
</script>
