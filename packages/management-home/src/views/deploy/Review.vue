<template>
  <div>
    <el-row>
      <el-col :offset="18" :span="6" style="text-align: right">
        <el-input
          suffix-icon="el-icon-search"
          placeholder="请输入服务名称"
          @input="filterpublish"
          v-model="searchProps.keyword"
        ></el-input>
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
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column label="发布类型" width="80" prop="moduleType"></el-table-column>
        <el-table-column label="发布名称" prop="name">
          <template #default="props">{{ props.row.name }}</template>
        </el-table-column>
        <el-table-column label="版本" width="80" prop="serviceVersion"></el-table-column>
        <el-table-column label="申请人" width="100" prop="publisher">
          <template #default="props">{{ props.row.publisher }}</template>
          <template #header>
            <i class="el-icon-search"></i>
            <el-popover placement="bottom" :width="200" trigger="manual" :visible="publisherTitleVisiable">
              <template #reference>
                <el-button type="text" @click="publisherTitleClick">申请人</el-button>
              </template>
              <el-select
                v-model="searchProps.publisher"
                placeholder="请输入申请人"
                clearable
                multiple
                filterable
                remote
                :remote-method="remoteMethod"
                @change="publisherChange"
              >
                <el-option
                  v-for="(item, index) in publisherFilters"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" width="180" prop="applyTime">
          <template #default="scope">{{ dateFormat(scope.row.applyTime) }}</template>
        </el-table-column>
        <el-table-column label="审核人" width="100" prop="reviewer">
          <!-- <template #default="props">{{ props.row.reviewer }}</template> -->
          <template #header>
            <i class="el-icon-search"></i>
            <el-popover placement="bottom" :width="200" trigger="manual" :visible="reviewerTitleVisiable">
              <template #reference>
                <el-button type="text" @click="reviewerTitleClick">审核人</el-button>
              </template>
              <el-select
                v-model="searchProps.reviewer"
                placeholder="请输入审核人"
                clearable
                multiple
                filterable
                remote
                :remote-method="remoteMethod"
                @change="reviewerChange"
              >
                <el-option
                  v-for="(item, index) in reviewerFilters"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="审核结果" prop="reviewResult">
          <!-- <template #default="props">{{ isReviewed(props.row) ? props.row.reviewResult : '' }}</template> -->
          <template #default="scope">
            <span>{{ getNameByCode(scope.row.status, 'status') }}</span>
          </template>
          <template #header>
            <i class="el-icon-search"></i>
            <el-popover placement="bottom" :width="200" trigger="manual" :visible="reviewResultsTitleVisiable">
              <template #reference>
                <el-button type="text" @click="reviewResultsTitleClick">审核结果</el-button>
              </template>
              <el-select
                v-model="searchProps.status"
                placeholder="请选择审核结果"
                clearable
                @change="auditResultsChange"
              >
                <el-option
                  v-for="(item, index) in auditResultsFilters"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="审核时间" width="180">
          <template #default="scope">{{ isReviewed(scope.row) ? dateFormat(scope.row.reviewTime) : '' }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="props">
            <el-button type="text" size="mini" @click="onReview(props.row)" :disabled="props.row.status !== 0">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <packaged-pagination
        v-if="total"
        :total="total"
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
      <el-form ref="reviewForm" :model="reviewState.formData">
        <el-form-item label="审核说明" prop="reviewContent" :rules="reviewRules">
          <el-input
            v-model="reviewState.formData.reviewContent"
            type="textarea"
            placeholder="请输入审核说明，不超过1024个字"
            :rows="5"
            maxlength="512"
            show-word-limit
          ></el-input>
        </el-form-item>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitReviewForm(true)">通过</el-button>
          <el-button @click="submitReviewForm(false)">不通过</el-button>
          <el-button @click="closeReviewDialog">关闭</el-button>
        </div>
      </el-form>
    </el-dialog>
    <div class="black-hovers" @click="blackHoverclick()" v-if="blackHoverVisible"></div>
  </div>
</template>

<script lang="ts">
import {
  getModuleType,
  getReviewResult,
  ReviewTableItemStruct,
  AUDIT_RESULTS_CODE,
  STATUS,
  AUDIT_RESULTS,
} from '@/views/deploy/index';
import { defineComponent, reactive, ref, toRefs, onBeforeMount } from 'vue';
import ListWrap from '@/components/list-wrap/Index.vue';
import PackagedPagination from '@/components/pagination/Index.vue';
import { ElMessage } from 'element-plus';
import { reviewApply, getReviewList } from '@/api/deploy/deploy-review';
import { findPublisherByName } from '@/api/deploy/deploy-apply';
import dateFormat from '@/utils/date-format';
import { getShowBool } from '@/utils/permission-show-module';
import { debounce } from 'lodash';

interface TableState {
  tableData: Array<ReviewTableItemStruct>;
  loading: boolean;
  total: number;
  reviewDialogVisible: boolean;
  publisherFilters: Array<object>;
  reviewerFilters: Array<object>;
  auditResultsFilters: Array<object>;
  searchProps: {
    keyword: string;
    page: number;
    pageSize: number;
    sortField: string;
    sortType: 'ascending' | 'descending';
  };
}

interface RiewFormState {
  isEdit: boolean;
  disabled: boolean;
  id: string;
  formData: {
    reviewer: number;
    reviewContent: string;
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
      publisherFilters: [],
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

    const reviewState: RiewFormState = reactive({
      isEdit: false,
      disabled: false,
      id: '',
      formData: {
        reviewer: 0,
        // reviewer: userInfo.value.userId,
        reviewContent: '',
      },
    });
    // 初始化reviewState
    function initReviewState() {
      reviewState.isEdit = false;
      reviewState.disabled = false;
      reviewState.id = '';
      reviewState.formData = {
        reviewer: 0,
        reviewContent: '',
      };
    }

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
        tableState.auditResultsFilters = Object.entries(STATUS).map((item) => ({
          id: item[0],
          name: item[1] ? item[1] : '未审核',
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

    // 发布筛选筛选
    const filterpublish = debounce(getTableData, 1000);

    const isReviewed = (row: any) => row.reviewResult;

    const reviewForm = ref(null as any);
    const reviewRules = [
      { required: true, message: '审核内容不能为空', trigger: 'blur' },
      { min: 1, max: 512, message: '最多支持512个字符' },
    ];

    const openReviewDialog = () => {
      tableState.reviewDialogVisible = !tableState.reviewDialogVisible;
    };

    const closeReviewDialog = () => {
      reviewForm.value.resetFields();
      initReviewState();
      openReviewDialog();
    };

    const blackHoverVisible = ref(false);
    const publisherTitleVisiable = ref(false);
    function publisherTitleClick() {
      publisherTitleVisiable.value = true;
      blackHoverVisible.value = true;
    }

    async function publisherChange() {
      publisherTitleVisiable.value = false;
      blackHoverVisible.value = false;
      await getTableData();
    }

    async function remoteMethod(keyword: string) {
      console.log('keyword:', keyword);
      if (keyword !== '') {
        const { data = [] } = await findPublisherByName({ keyword });
        console.log('keywordDatas:', data);
        const users = data.map((item: any) => ({
          id: item.id,
          name: item.userName,
        }));
        tableState.reviewerFilters = users;
        tableState.publisherFilters = users;
      } else {
        tableState.reviewerFilters = [];
        tableState.publisherFilters = [];
      }
    }

    const reviewResultsTitleVisiable = ref(false);
    function reviewResultsTitleClick() {
      reviewResultsTitleVisiable.value = true;
      blackHoverVisible.value = true;
    }

    async function auditResultsChange() {
      reviewResultsTitleVisiable.value = false;
      blackHoverVisible.value = false;
      await getTableData();
    }

    const reviewerTitleVisiable = ref(false);
    function reviewerTitleClick() {
      reviewerTitleVisiable.value = true;
      blackHoverVisible.value = true;
    }

    async function reviewerChange() {
      reviewerTitleVisiable.value = false;
      blackHoverVisible.value = false;
      await getTableData();
    }

    function blackHoverclick() {
      reviewResultsTitleVisiable.value = false;
      reviewerTitleVisiable.value = false;
      publisherTitleVisiable.value = false;
      blackHoverVisible.value = false;
    }
    onBeforeMount(() => {
      blackHoverclick();
    });

    function getNameByCode(code: number, type: string): string {
      let name = '';
      switch (type) {
        case 'status':
          name = STATUS[code];
          break;
        case 'auditResults':
          name = AUDIT_RESULTS[code];
          break;
        default:
          break;
      }
      return name;
    }

    // 审核
    const onReview = async (rowData: any) => {
      console.log('审核rowData：', rowData);
      reviewState.isEdit = true;
      reviewState.disabled = true;
      reviewState.id = rowData.id;
      reviewState.formData = {
        ...reviewState.formData,
        ...rowData,
      };
      openReviewDialog();
    };
    // 提交发布审核
    async function submitReviewForm(tempStatus: boolean) {
      reviewForm.value.validate(async (valid: boolean) => {
        if (valid) {
          const reviewData = {
            status: tempStatus ? AUDIT_RESULTS_CODE.PASSED : AUDIT_RESULTS_CODE.FAILED,
            reviewContent: reviewState.formData.reviewContent,
          };
          console.log('reviewState.id: ', reviewState.id);
          const { code } = await reviewApply(Number(reviewState.id), reviewData);
          if (code === 0) {
            ElMessage({
              type: 'success',
              message: '审核成功',
            });
            getTableData();
          } else {
            ElMessage({
              type: 'error',
              message: '审核失败',
            });
          }
          closeReviewDialog();
        }
      });
    }

    return {
      ...toRefs(tableState),
      reviewState,
      dateFormat,
      handlePageSizeChange,
      handlePageNumChange,
      getShowBool,
      isReviewed,
      onReview,
      reviewRules,
      closeReviewDialog,
      getNameByCode,
      reviewForm,
      submitReviewForm,
      filterpublish,
      blackHoverVisible,
      publisherTitleVisiable,
      publisherTitleClick,
      remoteMethod,
      publisherChange,
      reviewResultsTitleVisiable,
      reviewResultsTitleClick,
      auditResultsChange,
      reviewerTitleVisiable,
      reviewerTitleClick,
      reviewerChange,
      blackHoverclick,
    };
  },
});
</script>

<style>
.dialog-footer {
  display: flex;
  justify-content: center;
}
.black-hovers {
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 40;
}
</style>
