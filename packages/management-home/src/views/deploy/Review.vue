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
    <list-wrap :loading="loading" :empty="total === 0" :hasCreateAuth="false">
      <el-table :data="tableData">
        <el-table-column type="expand">
          <template #default="props">
            <el-form label-position="left">
              <el-form-item label="申请说明">
                <span>{{ props.row.publishContent }}</span>
              </el-form-item>
              <el-form-item label="审核说明" v-if="props.row.reviewContent">
                <span>{{ props.row.reviewContent }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index" width="60"></el-table-column>
        <el-table-column label="发布类型" width="80" prop="moduleType"></el-table-column>
        <el-table-column label="发布名称" prop="name">
          <template #default="props">
            <router-link
              :class="{ showlink: props.row.status !== 1 }"
              :to="{
                path: `/deploy/detail/${props.row.repositoryId}`,
              }"
              ><service-name :name="props.row.name" />
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="版本" width="100" prop="serviceVersion">
          <template #default="props">
            <el-button type="text" @click="handleShowVersionInfo(props.row)" :disabled="props.row.status !== 1">{{
              props.row.serviceVersion
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="申请人" prop="publisherName">
          <template #default="props">{{ props.row.publisherName }}</template>
          <template #header>
            <i class="el-icon-search"></i>
            <el-popover
              placement="bottom"
              :width="200"
              trigger="manual"
              :visible="publisherTitleVisiable"
              v-if="isShowPopover"
            >
              <template #reference>
                <el-button type="text" @click="publisherTitleClick">申请人</el-button>
              </template>
              <el-select
                v-model="searchProps.publisher"
                placeholder="请选择申请人"
                clearable
                multiple
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
        <el-table-column label="申请时间" width="190" prop="applyTime">
          <template #default="props">{{ dateFormat(props.row.applyTime) }}</template>
        </el-table-column>
        <el-table-column label="审核人" prop="reviewerName">
          <template #header>
            <i class="el-icon-search"></i>
            <el-popover
              placement="bottom"
              :width="200"
              trigger="manual"
              :visible="reviewerTitleVisiable"
              v-if="isShowPopover"
            >
              <template #reference>
                <el-button type="text" @click="reviewerTitleClick">审核人</el-button>
              </template>
              <el-select
                v-model="searchProps.reviewer"
                placeholder="请选择审核人"
                multiple
                clearable
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
        <el-table-column label="审核结果" prop="status">
          <template #default="props">
            <span>{{ getNameByCode(props.row.status, 'status') }}</span>
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
        <el-table-column label="审核时间" width="190">
          <template #default="props">{{ isReviewed(props.row) ? dateFormat(props.row.reviewTime) : '' }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="props">
            <el-button type="text" size="mini" @click="onReview(props.row)" :disabled="props.row.status !== 0"
              >审核</el-button
            >
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
          <el-button type="primary" @click="submitReviewForm(true)" :loading="btnLoading">通过</el-button>
          <el-button @click="submitReviewForm(false)" :loading="btnLoading">不通过</el-button>
          <el-button @click="closeReviewDialog">关闭</el-button>
        </div>
      </el-form>
    </el-dialog>
    <div class="black-hovers" @click="blackHoverclick()" v-if="blackHoverVisible"></div>
    <version-info-dialog ref="versionInfoDialogRef" />
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
import { defineComponent, reactive, ref, toRefs, onBeforeMount, onMounted } from 'vue';
import ListWrap from '@/components/list-wrap/Index.vue';
import PackagedPagination from '@/components/pagination/Index.vue';
import VersionInfoDialog from '@/views/service-repository/detail/Version-Info-Dialog.vue';
import { ElMessage } from 'element-plus';
import { reviewApply, getReviewList } from '@/api/deploy/deploy-review';
import { findPublisherByName, getSnapshotNo } from '@/api/deploy/deploy-apply';
import dateFormat from '@/utils/date-format';
import { getShowBool } from '@/utils/permission-show-module';
import { userInfo } from '@/layout/messageCenter/user-info';
import { debounce } from 'lodash';
import ServiceName from '@/views/service-management/components/ServiceName.vue';

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
  components: { ListWrap, PackagedPagination, VersionInfoDialog, ServiceName },
  setup() {
    const btnLoading = ref(false);
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
        // reviewer: 0,
        reviewer: userInfo.value.userId,
        reviewContent: '',
      },
    });

    function initReviewState() {
      reviewState.isEdit = false;
      reviewState.disabled = false;
      reviewState.id = '';
      reviewState.formData = {
        reviewer: userInfo.value.userId,
        reviewContent: '',
      };
    }

    const versionInfoDialogRef = ref(null as any);

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
    const isShowPopover = ref(true);
    function publisherTitleClick() {
      publisherTitleVisiable.value = true;
      blackHoverVisible.value = true;
    }

    async function publisherChange() {
      publisherTitleVisiable.value = false;
      isShowPopover.value = false;
      blackHoverVisible.value = false;
      await getTableData();
      isShowPopover.value = true;
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
      isShowPopover.value = false;
      blackHoverVisible.value = false;
      await getTableData();
      isShowPopover.value = true;
    }

    function blackHoverclick() {
      reviewResultsTitleVisiable.value = false;
      reviewerTitleVisiable.value = false;
      publisherTitleVisiable.value = false;
      blackHoverVisible.value = false;
    }

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

    const onReview = async (rowData: any) => {
      reviewState.isEdit = true;
      reviewState.disabled = true;
      reviewState.id = rowData.id;
      reviewState.formData = {
        ...reviewState.formData,
        ...rowData,
      };
      openReviewDialog();
    };

    async function submitReviewForm(tempStatus: boolean) {
      reviewForm.value.validate(async (valid: boolean) => {
        if (valid) {
          btnLoading.value = true;
          const reviewData = {
            id: reviewState.id,
            status: tempStatus ? AUDIT_RESULTS_CODE.PASSED : AUDIT_RESULTS_CODE.FAILED,
            reviewContent: reviewState.formData.reviewContent,
          };
          try {
            const { code } = await reviewApply(reviewData);
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
            btnLoading.value = false;
            closeReviewDialog();
          } catch (e) {
            ElMessage.error(e);
            btnLoading.value = false;
          }
        }
      });
    }

    const handleShowVersionInfo = async (row: any) => {
      const { data } = await getSnapshotNo(row.id);
      versionInfoDialogRef.value.handleOpen(data);
    };

    onBeforeMount(() => {
      blackHoverclick();
    });

    onMounted(async () => {
      const { data = [] } = await findPublisherByName();
      const users = data?.users;
      const publishers = data?.publishers;
      const reviewers = data?.reviewers;
      const userFilters = users.map((item: any) => ({
        id: item.id,
        name: item.displayName,
      }));
      tableState.publisherFilters = userFilters.filter((item: any) => publishers.includes(item.id));
      tableState.reviewerFilters = userFilters.filter((item: any) => reviewers.includes(item.id));
    });

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
      publisherChange,
      reviewResultsTitleVisiable,
      reviewResultsTitleClick,
      auditResultsChange,
      reviewerTitleVisiable,
      reviewerTitleClick,
      reviewerChange,
      blackHoverclick,
      isShowPopover,
      versionInfoDialogRef,
      handleShowVersionInfo,
      btnLoading,
    };
  },
});
</script>

<style lang="scss" scoped>
.showlink {
  pointer-events: none;
  color: #c0c4cc;
}
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
.is-puret {
  left: -200px !important;
}
</style>
