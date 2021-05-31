<template>
  <div class="general">
    <el-row>
      <el-col :offset="18" :span="6" style="text-align: right">
        <el-input
          placeholder="请输入服务名称"
          suffix-icon="el-icon-search"
          @input="filterpublish"
          v-model="searchProps.keyword"
        ></el-input>
      </el-col>
    </el-row>
    <el-row style="background: #fff">
      <el-table :data="tableData" v-loading="loading" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column label="发布名称" prop="name"></el-table-column>
        <el-table-column label="申请账号" prop="applicantName">
          <template #header>
            <i class="el-icon-search"></i>
            <el-popover placement="bottom" :width="200" trigger="manual" :visible="applicantTitleVisiable">
              <template #reference>
                <el-button type="text" @click="applicantTitleClick">申请账号</el-button>
              </template>
              <el-select
                v-model="searchProps.applicant"
                placeholder="请输入申请账号"
                clearable
                multiple
                filterable
                remote
                :remote-method="remoteMethod"
                @change="applicantChange"
              >
                <el-option
                  v-for="(item, index) in applicantFilters"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="发布描述" prop="description" show-overflow-tooltip></el-table-column>
        <el-table-column label="申请时间" prop="createTime">
          <template #default="scope">{{ dateFormat(scope.row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="审核结果" prop="auditResults">
          <template #default="scope">
            <span>{{ getNameByCode(scope.row.auditResults, 'auditResults') }}</span>
          </template>
          <template #header>
            <i class="el-icon-search"></i>
            <el-popover placement="bottom" :width="200" trigger="manual" :visible="auditResultsTitleVisiable">
              <template #reference>
                <el-button type="text" @click="auditResultsTitleClick">审核结果</el-button>
              </template>
              <el-select
                v-model="searchProps.auditResults"
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
        <el-table-column label="审核人" prop="reviewerName">
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
        <el-table-column label="审核说明" prop="auditInstructions" how-overflow-tooltip></el-table-column>
        <el-table-column label="发布时间" prop="publishTime">
          <template #default="scope">{{ dateFormat(scope.row.publishTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template #default="scope">
            <el-button type="primary" size="mini" :disabled="scope.row.auditResults !== 0" @click="onReview(scope.row)"
              >审核</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <packaged-pagination
        :current-page="searchProps.page"
        :page-size="searchProps.pageSize"
        :page-sizes="[10, 20, 50]"
        layout="sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handlePageSizeChange"
        @current-change="handlePageChange"
      ></packaged-pagination>
    </el-row>
    <el-dialog title="发布审核" v-model="addpublishDialog" width="600px" @closed="closepublishForm">
      <div class="add-publish-set">
        <el-form :model="publishForm.formData" :rules="publishRules" ref="publishFormRef">
          <el-form-item label="审核说明" prop="auditInstructions" :label-width="labelWidth">
            <el-input
              v-model="publishForm.formData.auditInstructions"
              type="textarea"
              :rows="4"
              maxlength="512"
              placeholder="请输入审核说明"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="submitpublishForm(true)">通 过</el-button>
          <el-button @click="submitpublishForm(false)">不通过</el-button>
          <el-button @click="closepublishForm">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
    <div class="black-hovers" @click="blackHoverclick()" v-if="blackHoverVisible"></div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, ref, onBeforeUnmount } from 'vue';
import { getPublishReviewList, reviewPublish, findUserByName } from '@/api/demands/publish';
import PackagedPagination from '@/components/pagination/Index.vue';
import { debounce } from 'lodash';
import { ElMessage } from 'element-plus';
import dateFormat from '@/utils/date-format';
import { userInfo } from '@/layout/messageCenter/user-info';
import { STATUS, AUDIT_RESULTS, AUDIT_RESULTS_CODE } from './constant';

interface TableState {
  tableData: Array<object>;
  auditResultsFilters: Array<object>;
  applicantFilters: Array<object>;
  reviewerFilters: Array<object>;
  loading: boolean;
  total: number;
  searchProps: {
    keyword: string;
    page: number;
    pageSize: number;
    sortField: string;
    sortType: 'ascending' | 'descending';
  };
}
interface PublishFormState {
  disabled: boolean;
  isEdit: boolean;
  id: string;
  formData: {
    reviewer: number;
    auditInstructions: string;
  };
}
export default {
  name: 'Review',
  components: {
    PackagedPagination,
  },
  setup() {
    // 表单相关状态
    const tableState: TableState = reactive({
      tableData: [],
      loading: false,
      total: 0,
      auditResultsFilters: [],
      applicantFilters: [],
      reviewerFilters: [],
      searchProps: {
        auditResults: null,
        keyword: '',
        page: 1,
        pageSize: 10,
        sortField: 'createTime',
        sortType: 'descending',
      },
    });
    // 新增配置表单数据
    const publishForm: PublishFormState = reactive({
      disabled: false,
      isEdit: false,
      id: '',
      formData: {
        reviewer: userInfo.value.userId,
        auditInstructions: '',
      },
    });
    const publishRules = {
      auditInstructions: [{ required: true, message: '请输入审核说明', trigger: 'blur' }],
    };

    // 初始化publishForm
    function initpublishForm() {
      publishForm.isEdit = false;
      publishForm.disabled = false;
      publishForm.id = '';
      publishForm.formData = {
        reviewer: userInfo.value.userId,
        auditInstructions: '',
      };
    }

    // 获取审核列表数据
    async function getTableData() {
      try {
        tableState.loading = true;
        const { data } = await getPublishReviewList(tableState.searchProps);
        tableState.loading = false;
        tableState.auditResultsFilters = Object.entries(AUDIT_RESULTS).map((item) => ({
          id: item[0],
          name: item[1] ? item[1] : '未审核',
        }));
        const { count, rows = [] } = data;
        tableState.total = count;
        const publishData = rows.map((item: any) => ({
          ...item,
          applicantName: `${userInfo.value.displayName}_${userInfo.value.userName}`,
        }));
        tableState.tableData = publishData;
      } catch (error) {
        tableState.loading = false;
        ElMessage({
          type: 'error',
          message: '获取申请列表失败',
        });
      }
    }
    getTableData();
    const labelWidth = ref('80px');
    const addpublishDialog = ref(false);

    const changeHistoryDialog = ref(false);

    const togglepublishDialog = () => {
      addpublishDialog.value = !addpublishDialog.value;
    };

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

    // 表单引用
    const publishFormRef: any = ref(null);

    // 关闭新增dialog
    function closepublishForm() {
      initpublishForm();
      togglepublishDialog();
    }

    // 提交发布审核
    async function submitpublishForm(status: boolean) {
      publishFormRef.value.validate(async (valid: boolean) => {
        if (valid) {
          const reviewData = {
            auditResults: status ? AUDIT_RESULTS_CODE.PASSED : AUDIT_RESULTS_CODE.FAILED,
            auditInstructions: publishForm.formData.auditInstructions,
          };
          const { code } = await reviewPublish(publishForm.id, reviewData);
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
          closepublishForm();
        }
      });
    }

    // 审核
    const onReview = async (rowData: any) => {
      publishForm.isEdit = true;
      publishForm.disabled = true;
      publishForm.id = rowData.id;
      publishForm.formData = {
        ...publishForm.formData,
        ...rowData,
      };
      togglepublishDialog();
    };

    // 发布筛选筛选
    const filterpublish = debounce(getTableData, 1000);

    // 每页条数改变
    const handlePageSizeChange = (pageSize: number) => {
      tableState.searchProps.pageSize = pageSize;
      getTableData();
    };

    // 页数切换
    const handlePageChange = (pageNum: number) => {
      tableState.searchProps.page = pageNum;
      getTableData();
    };

    // 筛选
    const blackHoverVisible = ref(false);
    const auditResultsTitleVisiable = ref(false);
    function auditResultsTitleClick() {
      auditResultsTitleVisiable.value = true;
      blackHoverVisible.value = true;
    }

    async function auditResultsChange() {
      auditResultsTitleVisiable.value = false;
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

    const applicantTitleVisiable = ref(false);
    function applicantTitleClick() {
      applicantTitleVisiable.value = true;
      blackHoverVisible.value = true;
    }

    async function applicantChange() {
      applicantTitleVisiable.value = false;
      blackHoverVisible.value = false;
      await getTableData();
    }
    async function remoteMethod(keyword: string) {
      if (keyword !== '') {
        const { data = [] } = await findUserByName({ keyword });
        const users = data.map((item: any) => ({
          id: item.id,
          name: item.userName,
        }));
        tableState.reviewerFilters = users;
        tableState.applicantFilters = users;
      } else {
        tableState.reviewerFilters = [];
        tableState.applicantFilters = [];
      }
    }
    function blackHoverclick() {
      auditResultsTitleVisiable.value = false;
      reviewerTitleVisiable.value = false;
      applicantTitleVisiable.value = false;
      blackHoverVisible.value = false;
    }
    onBeforeUnmount(() => {
      blackHoverclick();
    });

    return {
      ...toRefs(tableState),
      labelWidth,
      publishForm,
      publishRules,
      addpublishDialog,
      changeHistoryDialog,
      publishFormRef,
      submitpublishForm,
      closepublishForm,
      onReview,
      filterpublish,
      handlePageSizeChange,
      handlePageChange,
      dateFormat,
      getNameByCode,
      auditResultsTitleVisiable,
      auditResultsTitleClick,
      auditResultsChange,
      reviewerTitleVisiable,
      reviewerTitleClick,
      reviewerChange,
      applicantTitleVisiable,
      applicantTitleClick,
      applicantChange,
      remoteMethod,
      blackHoverVisible,
      blackHoverclick,
    };
  },
};
</script>

<style scoped>
.datatype-add {
  float: right;
  margin-bottom: 12px;
}
.el-select {
  width: 100%;
}
.dialog-footer {
  width: 100%;
  display: block;
  text-align: center;
  margin-bottom: 20px;
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
