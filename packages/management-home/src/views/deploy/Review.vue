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
            <el-button type="text" size="mini" :disabled="isReviewed(props.row)" @click="openReviewDialog"
              >审核</el-button
            >
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
    <el-dialog width="600px" title="发布审核" v-model="reviewDialogVisible">
      <el-form ref="reviewForm">
        <el-form-item label="审核说明" prop="reviewContent" :rules="reviewRules">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 7 }"
            placeholder="请输入审核说明，最多不超过1024个字"
          ></el-input>
        </el-form-item>
        <div class="dialog-footer">
          <el-button type="primary" @click="reviewApproval">通过</el-button>
          <el-button @click="reviewRefuse">不通过</el-button>
          <el-button @click="closeReviewDialog">关闭</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { getModuleType, getReviewResult, ReviewTableItemStruct } from '@/views/deploy/index';
import { defineComponent, reactive, ref, toRefs } from 'vue';
import ListWrap from '@/components/list-wrap/Index.vue';
import PackagedPagination from '@/components/pagination/Index.vue';
import { ElMessage } from 'element-plus';
import { approveServiceApply, getReviewList } from '@/api/deploy/deploy-review';
import dateFormat from '@/utils/date-format';
import { getShowBool } from '@/utils/permission-show-module';

interface TableState {
  tableData: Array<ReviewTableItemStruct>;
  loading: boolean;
  total: number;
  reviewDialogVisible: boolean;
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
      reviewDialogVisible: false,
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

    const reviewFrom = ref(null as any);

    const openReviewDialog = () => {
      tableState.reviewDialogVisible = true;
    };
    const closeReviewDialog = () => {
      tableState.reviewDialogVisible = false;
      reviewFrom.value.resetFields();
    };

    // 点击通过，审核结果转为“通过”，内部版本转正式版本，服务版本将会出现在租户仓库内
    const reviewApproval = async (rowData: any) => {
      reviewFrom.value.validate(async (valid: boolean) => {
        if (valid) {
          const { code } = await approveServiceApply(rowData.id);
          if (code === 0) {
            ElMessage({
              type: 'success',
              message: '服务已发布至租户仓库',
            });
          } else {
            ElMessage({
              type: 'error',
              message: '服务发布失败',
            });
          }
          closeReviewDialog();
        }
      });
    };

    // 点击不通过，审核结果改为"未通过"，服务内部版本保持不变
    // （ 暂时没有写内容 ）
    const reviewRefuse = () => {
      console.log();
    };
    const reviewRules = [
      { required: true, message: '内容不能为空', trigger: 'blur' },
      {
        min: 1,
        max: 1024,
        message: '最多支持1024个字符',
      },
    ];

    return {
      ...toRefs(tableState),
      dateFormat,
      handlePageSizeChange,
      handlePageNumChange,
      getShowBool,
      isReviewed,
      openReviewDialog,
      reviewRules,
      closeReviewDialog,
      reviewFrom,
      reviewApproval,
      reviewRefuse,
    };
  },
});
</script>

<style>
.dialog-footer {
  display: flex;
  justify-content: center;
}
</style>
