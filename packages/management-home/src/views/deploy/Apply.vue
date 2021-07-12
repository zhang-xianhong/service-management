<template>
  <div>
    <el-row>
      <el-col :span="6" style="text-align: left">
        <el-button icon="el-icon-plus" type="primary" style="width: 90px" @click="openCreateDialog"> 新建 </el-button>
      </el-col>
      <el-col :offset="12" :span="6" style="text-align: right">
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
              <el-form-item label="审核说明" v-if="props.row.reviewContent">
                <span>{{ props.row.reviewContent }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index" width="50"> </el-table-column>
        <el-table-column label="发布类型" width="80" prop="moduleType"></el-table-column>
        <el-table-column label="发布名称" prop="name" width="100">
          <template #default="props">
            <router-link
              :to="{
                path: `/service-management/service-list/detail/${props.row.id}`,
                query: { detailName: props.row.name },
              }"
              >{{ props.row.name }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="版本" width="80" prop="serviceVersion"></el-table-column>
        <el-table-column label="申请人" prop="publisherName" width="100">
          <template #default="props">{{ props.row.publisherName }}</template>
          <template #header>
            <i class="el-icon-search"></i>
            <el-popover placement="bottom" :width="200" trigger="manual" :visible="publisherTitleVisiable" v-if="isShowPopover">
              <template #reference>
                <el-button type="text" @click="publisherTitleClick">申请人</el-button>
              </template>
              <el-select
                v-model="searchProps.publisher"
                placeholder="请输入申请人"
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
        <el-table-column label="申请时间" width="180" prop="applyTime">
          <template #default="props">{{ dateFormat(props.row.applyTime) }}</template>
        </el-table-column>
        <el-table-column label="审核人" width="100" prop="reviewerName">
          <template #header>
            <i class="el-icon-search"></i>
            <el-popover placement="bottom" :width="200" trigger="manual" :visible="reviewerTitleVisiable" v-if="isShowPopover">
              <template #reference>
                <el-button type="text" @click="reviewerTitleClick">审核人</el-button>
              </template>
              <el-select
                v-model="searchProps.reviewer"
                placeholder="请输入审核人"
                clearable
                multiple
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
        <el-table-column label="审核时间" width="180">
          <template #default="props">{{ dateFormat(props.row.reviewTime) }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="props">
            <el-button
              type="text"
              size="mini"
              @click="updateReleaseInfo(props.row)"
              :disabled="getRowOptionStatus(props.row)"
              >编辑</el-button
            >
            <el-button type="text" @click="removeApply(props.row)" :disabled="getRowOptionStatus(props.row)"
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
        :total="total"
        layout="sizes, prev, pager, next, jumper"
        @size-change="handlePageSizeChange"
        @current-change="handlePageNumChange"
      >
      </packaged-pagination>
    </list-wrap>
    <service-info
      :visable="createDialogVisible"
      :releaseForms="releaseForm"
      @close="closeReleaseForm"
      @getTableInfo="getTableData"
    />
    <div class="black-hovers" @click="blackHoverclick()" v-if="blackHoverVisible"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onBeforeMount, onMounted } from 'vue';
import ServiceInfo from './ServiceInfo.vue';
import { DeployTableItemStruct, AUDIT_RESULTS, getModuleType, getReviewResult, STATUS } from '@/views/deploy/index';

import { ElMessage, ElMessageBox } from 'element-plus';
import dateFormat from '@/utils/date-format';
import { deleteApply, getDeployList, findPublisherByName, getServiceList } from '@/api/deploy/deploy-apply';
import PackagedPagination from '@/components/pagination/Index.vue';
import ListWrap from '@/components/list-wrap/Index.vue';
import { getShowBool } from '@/utils/permission-show-module';
import { userInfo } from '@/layout/messageCenter/user-info';
import { debounce } from 'lodash';

interface TableState {
  tableData: Array<DeployTableItemStruct>;
  loading: boolean;
  total: number;
  createDialogVisible: boolean;
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

interface ReleaseState {
  disabled: boolean;
  isEdit: boolean;
  id: string;
  serviceList: Array<object>;
  versionOptions: Array<object>;
  services: Array<object>;
  types: Array<object>;
  serviceInfo: {
    name: string;
    serviceVersion: string;
    type: number;
    moduleId: number;
    publisher: number;
    publisherName: string;
    publishContent: string;
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
      publisherFilters: [],
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
        type: 1,
        moduleId: 0,
        name: '',
        serviceVersion: '',
        publisher: userInfo.value.userId,
        publisherName: `${userInfo.value.displayName}_${userInfo.value.userName}`,
        publishContent: '',
      },
      serviceList: [],
      versionOptions: [],
      services: [],
      types: [
        { id: 1, name: '服务' },
        { id: 2, name: '应用' },
      ],
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
          reviewResult: getReviewResult(item.status),
        }));
        tableState.auditResultsFilters = Object.entries(STATUS).map((item) => ({
          id: item[0],
          name: item[1] ? item[1] : '未审核',
        }));
        console.log('tableState.tableData: ', tableState.tableData);
      } catch (error) {
        tableState.loading = false;
        ElMessage({
          type: 'error',
          message: '获取申请列表失败',
        });
      }
    }
    getTableData();

    // 获取服务列表
    async function getServices() {
      // const { data } = await getServiceList({ all: true });
      const { data } = await getServiceList();
      releaseForm.services = data.map((item: any) => ({
        serviceName: item.serviceName,
        versions: item.versions,
      }));
      releaseForm.serviceList = data.map((item: any) => ({
        // id: item.id ? item.id : item.serviceName,
        id: item.serviceName,
        name: item.serviceName,
      }));
    }

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

    // 发布筛选筛选
    const filterpublish = debounce(getTableData, 1000);

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
        type: 1,
        moduleId: 0,
        name: '',
        serviceVersion: '',
        publisher: userInfo.value.userId,
        publisherName: `${userInfo.value.displayName}_${userInfo.value.userName}`,
        publishContent: '',
      };
      // getServices();
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
          ElMessage({
            type: 'success',
            message: '申请删除成功',
          });
          getTableData();
        } else {
          ElMessage({
            type: 'error',
            message: '申请删除失败',
          });
        }
      });
    };

    // 新建表单
    const openCreateDialog = () => {
      tableState.createDialogVisible = !tableState.createDialogVisible;
      getServices();
    };

    // 关闭对话框
    const closeReleaseForm = () => {
      initReleaseForm();
      openCreateDialog();
    };

    function getRowOptionStatus(row: any) {
      // return userInfo.value.userId !== row.publisher || row.status !== 0;
      return row.status !== 0;
    }

    // 编辑
    const updateReleaseInfo = (rowData: any) => {
      releaseForm.isEdit = true;
      releaseForm.disabled = true;
      releaseForm.id = rowData.id;
      releaseForm.serviceInfo = {
        ...releaseForm.serviceInfo,
        ...rowData,
      };
      // openCreateDialog();
      tableState.createDialogVisible = !tableState.createDialogVisible;
    };

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
      filterpublish,
      getNameByCode,
      getRowOptionStatus,
      blackHoverVisible,
      publisherTitleVisiable,
      publisherTitleClick,
      // remoteMethod,
      publisherChange,
      reviewResultsTitleVisiable,
      reviewResultsTitleClick,
      auditResultsChange,
      reviewerTitleVisiable,
      reviewerTitleClick,
      reviewerChange,
      blackHoverclick,
      isShowPopover
    };
  },
});
</script>

<style lang="scss" scoped>
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
