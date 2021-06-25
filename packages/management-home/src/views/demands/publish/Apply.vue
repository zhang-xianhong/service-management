<template>
  <div class="general">
    <el-row style="margin-bottom: 10px;">
      <el-col :span="6" style="text-align: left">
        <el-button
          icon="el-icon-plus"
          type="primary"
          @click="addNewpublish"
          style="width: 90px"
          v-if="getShowBool('add')"
          >新建</el-button
        >
      </el-col>
      <el-col :offset="12" :span="6" style="text-align: right">
        <el-input
          style="max-width: 300px; margin-left: auto"
          placeholder="请输入服务名称"
          suffix-icon="el-icon-search"
          @input="filterpublish"
          v-model="searchProps.keyword"
        ></el-input>
      </el-col>
    </el-row>

    <list-wrap
      :loading="loading"
      :empty="total === 0"
      :handleCreate="addNewpublish"
      :hasCreateAuth="getShowBool('add')"
    >
      <el-table :data="tableData" class="publish-table" @selection-change="handleSelectionChange">
        <el-table-column type="expand">
          <template #default="props">
            <el-form label-position="left" class="publish-table-expand">
              <el-form-item label="发布说明">
                <span>{{ props.row.description }}</span>
              </el-form-item>
              <el-form-item label="审核说明" v-if="props.row.auditInstructions">
                <span>{{ props.row.auditInstructions }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column label="发布类型" prop="moduleType"></el-table-column>
        <el-table-column label="发布名称" prop="name">
          <template #default="props">
            {{ props.row.name }}
          </template>
        </el-table-column>
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
        <el-table-column label="发布版本" prop="version"></el-table-column>
        <el-table-column label="发布时间" prop="publishTime">
          <template #default="scope">{{ dateFormat(scope.row.publishTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template #default="scope">
            <el-button
              type="text"
              size="mini"
              @click="onEdit(scope.row)"
              :disabled="getRowOptionStatus(scope.row)"
              v-if="getShowBool('update')"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="mini"
              @click="onDelete(scope.row)"
              :disabled="getRowOptionStatus(scope.row)"
              v-if="getShowBool('delete')"
              >删除</el-button
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
        :total="total"
        @size-change="handlePageSizeChange"
        @current-change="handlePageChange"
      ></packaged-pagination>
    </list-wrap>

    <el-dialog
      :title="publishForm.isEdit ? '编辑' : '新建'"
      v-model="addpublishDialog"
      width="600px"
      @closed="closepublishForm"
    >
      <div class="add-publish-set">
        <el-form :model="publishForm.formData" :rules="publishRules" ref="publishFormRef">
          <el-form-item label="发布类型" prop="moduleType" :label-width="labelWidth">
            <el-select
              v-model="publishForm.formData.moduleType"
              placeholder="请选择发布类型"
              clearable
              :disabled="publishForm.disabled"
            >
              <el-option
                v-for="(item, index) in publishForm.moduleType"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务名称" prop="name" :label-width="labelWidth" :v-if="publishForm.moduleType === 1">
            <el-select
              v-model="publishForm.formData.name"
              placeholder="请选择服务"
              filterable
              clearable
              @change="serviceChange"
              :disabled="publishForm.disabled"
            >
              <el-option
                v-for="(item, index) in publishForm.serviceList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="应用名称" prop="name" :label-width="labelWidth" :v-if='publishForm.moduleType===2'>
            <el-input v-model="publishForm.formData.name" :disabled="publishForm.disabled"></el-input>
          </el-form-item> -->
          <el-form-item label="申请账号" prop="applicantName" :label-width="labelWidth">
            <el-input v-model="publishForm.formData.applicantName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="发布版本" prop="version" :label-width="labelWidth">
            <el-select
              v-model="publishForm.formData.version"
              placeholder="请选择发布版本"
              clearable
              :disabled="publishForm.disabled"
            >
              <el-option
                v-for="(item, index) in publishForm.versionOptions"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布说明" prop="description" :label-width="labelWidth">
            <el-input
              v-model="publishForm.formData.description"
              type="textarea"
              :rows="2"
              maxlength="512"
              placeholder="请输入发布说明"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="submitpublishForm">确定</el-button>
          <el-button @click="closepublishForm">取消</el-button>
        </span>
      </template>
    </el-dialog>
    <div class="black-hovers" @click="blackHoverclick()" v-if="blackHoverVisible"></div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, ref, onBeforeUnmount } from 'vue';
import {
  getPublishList,
  addPublish,
  updatePublish,
  deletePublish,
  getServiceList,
  findUserByName,
} from '@/api/demands/publish';
import PackagedPagination from '@/components/pagination/Index.vue';
import { debounce } from 'lodash';
import { ElMessageBox, ElMessage } from 'element-plus';
import dateFormat from '@/utils/date-format';
import { userInfo } from '@/layout/messageCenter/user-info';
import { STATUS, AUDIT_RESULTS, getModuleType } from './constant';
import { getShowBool } from '@/utils/permission-show-module';

interface TableState {
  tableData: Array<object>;
  loading: boolean;
  total: number;
  statusFilters: Array<object>;
  auditResultsFilters: Array<object>;
  applicantFilters: Array<object>;
  reviewerFilters: Array<object>;
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
  serviceList: Array<object>;
  applicationList: Array<object>;
  versionOptions: Array<object>;
  formData: {
    moduleType: number;
    moduleId: number;
    name: string;
    applicant: number;
    applicantName: string;
    version: number;
    description: string;
  };
}
export default {
  name: 'Apply',
  components: {
    PackagedPagination,
  },
  setup() {
    // 表单相关状态
    const tableState: TableState = reactive({
      tableData: [],
      loading: false,
      total: 0,
      statusFilters: [],
      auditResultsFilters: [],
      applicantFilters: [],
      reviewerFilters: [],
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
    // 新增发布表单数据
    const publishForm: PublishFormState = reactive({
      disabled: false,
      isEdit: false,
      id: '',
      formData: {
        moduleType: 1,
        moduleId: 0,
        name: '',
        applicant: userInfo.value.userId,
        applicantName: `${userInfo.value.displayName}_${userInfo.value.userName}`,
        version: 1,
        description: '',
      },
      serviceList: [],
      applicationList: [],
      versionOptions: [{ id: 1, name: '1' }],
      moduleType: [
        { id: 1, name: '服务' },
        // { id: 2, name: '应用' },
      ],
    });
    const publishRules = {
      moduleType: [{ required: true, message: '请选择发布类型', trigger: 'change' }],
      name: [{ required: true, message: '请输入发布名称', trigger: 'change' }],
      applicant: [{ required: true, message: '请选择申请账号', trigger: 'change' }],
      version: [{ required: true, message: '请选择发布版本', trigger: 'change' }],
      description: [{ required: true, message: '请输入发布说明', trigger: 'blur' }],
    };

    // 初始化publishForm
    function initpublishForm() {
      publishForm.isEdit = false;
      publishForm.disabled = false;
      publishForm.id = '';
      publishForm.formData = {
        moduleType: 1,
        moduleId: 0,
        name: '',
        applicant: userInfo.value.userId,
        applicantName: `${userInfo.value.displayName}_${userInfo.value.userName}`,
        version: 1,
        description: '',
      };
    }

    // 获取发布列表数据
    async function getTableData() {
      try {
        tableState.loading = true;
        const { data } = await getPublishList(tableState.searchProps);
        tableState.loading = false;
        tableState.statusFilters = Object.entries(STATUS).map((item) => ({
          id: item[0],
          name: item[1],
        }));
        tableState.auditResultsFilters = Object.entries(AUDIT_RESULTS).map((item) => ({
          id: item[0],
          name: item[1] ? item[1] : '未审核',
        }));
        const { count, rows = [] } = data;
        tableState.total = count;
        const publishData = rows.map((item: any) => ({
          ...item,
          moduleType: getModuleType(item.moduleType),
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

    // 获取服务列表
    async function getServices() {
      const { data } = await getServiceList({ all: true });
      const servides = data.rows || [];
      publishForm.serviceList = servides.map((item: any) => ({
        id: item.id,
        name: `${item.description}_${item.name}`,
      }));
    }

    // 改变service方法
    function serviceChange(serviceId: any) {
      const data: any = publishForm.serviceList.find((i: any) => i.id === serviceId);
      publishForm.formData.moduleId = serviceId;
      publishForm.formData.name = data?.name;
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

    function filterStatus(value: number, row: any) {
      console.log('value', value);
      return row.status === value;
    }
    // 表单引用
    const publishFormRef: any = ref(null);

    // 关闭新增dialog
    function closepublishForm() {
      initpublishForm();
      publishFormRef.value.resetFields();
      togglepublishDialog();
    }

    // 提交发布申请
    async function submitpublishForm() {
      publishFormRef.value.validate(async (valid: boolean) => {
        if (valid) {
          // 添加
          if (!publishForm.isEdit) {
            const publishData = publishForm.formData;
            const { code } = await addPublish(publishData);
            if (code === 0) {
              ElMessage({
                type: 'success',
                message: '添加成功',
              });
              getTableData();
            } else {
              ElMessage({
                type: 'error',
                message: '添加失败',
              });
            }
            closepublishForm();
          } else {
            // 编辑
            console.log(publishForm);
            const { code } = await updatePublish(publishForm.id, {
              description: publishForm.formData.description,
            });
            if (code === 0) {
              ElMessage({
                type: 'success',
                message: '更新成功',
              });
              getTableData();
            } else {
              ElMessage({
                type: 'error',
                message: '编辑失败',
              });
            }
            closepublishForm();
          }
        }
      });
    }

    // 新建发布申请
    function addNewpublish() {
      togglepublishDialog();
      getServices();
    }

    // 开启编辑
    function ableEdit() {
      publishForm.disabled = false;
    }

    // 编辑发布
    const onEdit = async (rowData: any) => {
      publishForm.isEdit = true;
      publishForm.disabled = true;
      publishForm.id = rowData.id;
      publishForm.formData = {
        ...publishForm.formData,
        ...rowData,
      };
      togglepublishDialog();
    };

    // 删除发布申请
    const onDelete = async (rowData: any) => {
      ElMessageBox.confirm(`是否删除发布申请?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { code }: any = await deletePublish(rowData.id);
          if (code === 0) {
            ElMessage({
              type: 'success',
              message: '删除成功',
            });
            getTableData();
          } else {
            ElMessage({
              type: 'error',
              message: '删除失败',
            });
          }
        })
        .catch(() => {
          console.log();
        });
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
    // 筛选
    const blackHoverVisible = ref(false);
    const statusTitleVisiable = ref(false);
    function statusTitleClick() {
      statusTitleVisiable.value = true;
      blackHoverVisible.value = true;
    }

    const auditResultsTitleVisiable = ref(false);
    function auditResultsTitleClick() {
      auditResultsTitleVisiable.value = true;
      blackHoverVisible.value = true;
    }

    async function statusChange() {
      statusTitleVisiable.value = false;
      blackHoverVisible.value = false;
      await getTableData();
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

    function blackHoverclick() {
      auditResultsTitleVisiable.value = false;
      statusTitleVisiable.value = false;
      reviewerTitleVisiable.value = false;
      applicantTitleVisiable.value = false;
      blackHoverVisible.value = false;
    }
    onBeforeUnmount(() => {
      blackHoverclick();
    });

    function getRowOptionStatus(row: any) {
      return userInfo.value.userId !== row.applicant || row.status !== 0;
    }

    return {
      ...toRefs(tableState),
      addNewpublish,
      labelWidth,
      publishForm,
      publishRules,
      addpublishDialog,
      changeHistoryDialog,
      publishFormRef,
      submitpublishForm,
      closepublishForm,
      ableEdit,
      onEdit,
      onDelete,
      filterpublish,
      handlePageSizeChange,
      handlePageChange,
      dateFormat,
      serviceChange,
      getNameByCode,
      filterStatus,
      statusTitleVisiable,
      statusTitleClick,
      statusChange,
      auditResultsTitleVisiable,
      auditResultsTitleClick,
      auditResultsChange,
      blackHoverVisible,
      blackHoverclick,
      remoteMethod,
      reviewerTitleVisiable,
      reviewerTitleClick,
      reviewerChange,
      applicantTitleVisiable,
      applicantTitleClick,
      applicantChange,
      getShowBool,
      getRowOptionStatus,
    };
  },
};
</script>

<style lang="scss">
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
.publish-table {
  width: 100%;
  &-expand {
    label {
      width: 90px;
      color: #99a9bf;
    }
  }
  .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
  }
  .el-form-item__content {
    padding-left: 90px;
    font-size: 12px;
  }
}
</style>
