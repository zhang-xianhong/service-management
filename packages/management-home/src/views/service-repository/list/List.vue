<template>
  <div class="g-data-list">
    <el-row>
      <el-col :span="6" style="text-align: left"></el-col>
      <el-col :offset="12" :span="6" style="text-align: right">
        <el-input
          placeholder="请输入服务名称"
          suffix-icon="el-icon-search"
          @input="handlerSearch"
          v-model="searchProps.keyword"
        ></el-input>
      </el-col>
    </el-row>
    <list-wrap :loading="loading" :inProject="false" :empty="total === 0" :hasCreateAuth="false">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="序号" type="index"> </el-table-column>
        <el-table-column prop="serviceName" label="服务英文名">
          <template #default="scope">
            <router-link :to="`${route.fullPath}/${scope.row.id}`">
              <service-name :name="scope.row.serviceName"
            /></router-link>
          </template>
        </el-table-column>
        <el-table-column prop="serviceNameZh" label="服务中文名">
          <template #default="scope">
            {{ scope.row.snapshotInfo?.serviceNameZh }}
          </template>
        </el-table-column>
        <el-table-column prop="level" label="级别">
          <template #default="scope">
            {{ serviceLevels[scope.row.snapshotInfo?.level] }}
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型">业务服务</el-table-column>
        <el-table-column prop="classification" label="分类">
          <template #header>
            <i class="el-icon-search"></i>
            <el-popover placement="bottom" :width="200" trigger="manual" :visible="classification.visible">
              <template #reference>
                <el-button type="text" @click="() => (classification.visible = true)">分类</el-button>
              </template>
              <el-cascader
                v-model="searchProps.classification"
                :options="classificationList"
                :props="classification.props"
                clearable
                filterable
                placeholder="请选择分类"
                @change="classification.handleChange"
              ></el-cascader>
            </el-popover>
          </template>
          <template #default="scope">
            {{ getClassificationName(scope.row.snapshotInfo.classification, classificationList) }}
          </template>
        </el-table-column>
        <el-table-column prop="tag" label="标签">
          <template #header>
            <i class="el-icon-search"></i>
            <el-popover placement="bottom" :width="200" trigger="manual" :visible="tagFilter.visible">
              <template #reference>
                <el-button type="text" @click="() => (tagFilter.visible = true)">标签</el-button>
              </template>
              <el-select v-model="searchProps.tags" placeholder="请选择标签" clearable multiple>
                <el-option
                  v-for="(item, index) in tagList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-popover>
          </template>
          <template #default="scope">
            {{ getTagsName(String(scope.row.snapshotInfo.tag || '').split(','), tagList) }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="服务来源" v-if="listType !== 'platform'"> </el-table-column>
        <el-table-column prop="address" label="开发方">
          <template #default="scope">
            {{ scope.row.snapshotInfo?.developer }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="权限">
          <template #default="scope">
            {{ getSharedType(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column prop="serviceVersion" label="版本">
          <template #default="scope">
            {{ scope.row.snapshotInfo?.serviceVersion }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template #default="scope">
            <!-- {{ scope.row.snapshotInfo?.developer }} -->
            <el-button type="text" v-if="listType === 'shared'" @click="handleShare(scope.row)">共享</el-button>
            <el-button type="text" v-if="listType === 'distribute'" @click="handleDistribute(scope.row)"
              >下发</el-button
            >
            <el-button type="text" v-if="listType === 'platform'" @click="handlePull(scope.row)">拉取</el-button>
          </template>
        </el-table-column>
      </el-table>
      <packaged-pagination
        @size-change="handlerPageSizeChange"
        @current-change="handleCurrentPageChange"
        :current-page="searchProps.page"
        :page-size="searchProps.pageSize"
        :total="total"
        v-if="total > 0"
      ></packaged-pagination>
    </list-wrap>
    <distribute-dialog ref="distributeDialogRef" :refresh="fetchData" />
    <shared-dialog ref="sharedDialogRef" :refresh="fetchData" />
    <div
      class="blank-overlay"
      @click="handleCloseFilterOverlay"
      v-if="classification.visible || tagFilter.visible"
    ></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import DistributeDialog from '../components/dialog/Distribute.vue';
import SharedDialog from '../components/dialog/Shared.vue';
import { getRepositoryList, pullRepository } from '@/api/repository';
import { getAllTags } from '@/api/settings/tags';
import { getClassificationList } from '@/api/settings/classification';
import { getSharedType, SERVICE_LEVEL } from './config';
import { filterClassificationList, getClassificationName, getTagsName } from '../util';
interface TableState {
  tableData: Array<object>;
  loading: boolean;
  total: number;
  searchProps: {
    keyword: string;
    page: number;
    pageSize: number;
    sortField: string;
    classification: string;
    tags: string[];
    sortType: 'ascending' | 'descending';
  };
}
export default defineComponent({
  components: {
    DistributeDialog,
    SharedDialog,
  },
  props: {
    listType: {
      type: String,
    },
  },
  name: 'ServiceRepositoryList',
  setup(props) {
    const sharedDialogRef = ref(null as any);
    const distributeDialogRef = ref(null as any);
    const classificationList = ref([] as any);
    const tagList = ref([] as any);
    const route = useRoute();
    // 表单相关状态
    const tableState: TableState = reactive({
      tableData: [],
      loading: false,
      total: 0,
      searchProps: {
        keyword: '',
        classification: '',
        tags: [],
        status: null,
        auditResults: null,
        page: 1,
        pageSize: 10,
        sortField: 'createTime',
        sortType: 'descending',
      },
    });
    let platformType = 0;
    switch (props.listType) {
      case 'platform':
        platformType = 0;
        break;
      case 'shared':
        platformType = 1;
        break;
      case 'distribute':
        platformType = 2;
        break;
    }

    const fetchAllData = async () => {
      tableState.loading = true;
      try {
        const [classificationRes, tagsRes, listRes] = await Promise.all([
          getClassificationList(),
          getAllTags(),
          getRepositoryList({
            ...tableState.searchProps,
            platformType,
          }),
        ]);
        const { rows, count } = listRes.data;
        classificationList.value = filterClassificationList(classificationRes.data);
        tagList.value = tagsRes.data;
        tableState.tableData = rows;
        tableState.total = count;
      } catch (e) {
        console.log(e);
      }
      tableState.loading = false;
    };

    const fetchData = async () => {
      tableState.loading = true;
      try {
        const { rows, count } = (
          await getRepositoryList({
            ...tableState.searchProps,
            platformType,
          })
        ).data;
        tableState.tableData = rows;
        tableState.total = count;
      } catch (e) {
        console.log(e);
      }
      tableState.loading = false;
    };

    const classification: any = reactive({
      visible: false,
      props: {
        label: 'name',
        value: 'id',
        emitPath: false,
      },
      handleChange(value: string) {
        tableState.searchProps.classification = value;
      },
    });

    const tagFilter: any = reactive({
      visible: false,
    });

    function handleCloseFilterOverlay() {
      classification.visible = false;
      tagFilter.visible = false;
      tableState.searchProps.page = 1;
      fetchData();
    }

    const handlerSearch = (value: string) => {
      tableState.searchProps.keyword = value;
      tableState.searchProps.page = 1;
      fetchData();
    };

    const handlerPageSizeChange = (size: number) => {
      tableState.searchProps.pageSize = size;
      fetchData();
    };

    const handleCurrentPageChange = (page: number) => {
      tableState.searchProps.page = page;
      fetchData();
    };

    const handleShare = (row: any) => {
      sharedDialogRef.value.handleOpen(row);
    };

    const handleDistribute = (row: any) => {
      distributeDialogRef.value.handleOpen(row);
    };

    const handlePull = (row: any) => {
      // distributeDialogRef.value.handleOpen(row);
      ElMessageBox.confirm(
        `将该服务从平台仓库拉取至租户仓库后，租户内的项目可按照该服务提供的相应权限进行开发。`,
        '确定拉取至租户',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: '',
        },
      ).then(async () => {
        await pullRepository({
          repositoryId: row.id,
          tenantPermission: row.platformShareType,
        });
        ElMessage.success('拉取至租户仓库成功');
        fetchData();
      });
    };

    fetchAllData();

    return {
      ...toRefs(tableState),
      handlerSearch,
      handlerPageSizeChange,
      handleCurrentPageChange,
      getSharedType(row: any) {
        return getSharedType(row.platformShareType);
      },
      handleShare,
      handlePull,
      handleDistribute,
      sharedDialogRef,
      distributeDialogRef,
      serviceLevels: {
        ...SERVICE_LEVEL,
      },
      route,
      fetchData,
      classification,
      classificationList,
      tagList,
      tagFilter,
      handleCloseFilterOverlay,
      getTagsName,
      getClassificationName,
    };
  },
});
</script>
<style lang="scss" scoped>
.blank-overlay {
  width: 100vw;
  height: 100vh;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.2);
  top: 0;
  left: 0;
  z-index: 40;
}
</style>
