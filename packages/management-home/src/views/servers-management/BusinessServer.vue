<template>
  <data-list :page="currentPage" :page-size="pageSize" :total="serveList.total" @pageChange="getPageChange">
    <template #headLeft>
      <el-button type="primary" @click="goCreatePage">新增</el-button>
      <el-button>克隆</el-button>
      <el-button>继承</el-button>
      <el-button>启动</el-button>
      <el-button>停止</el-button>
      <el-button>发布</el-button>
      <el-button>删除</el-button>
    </template>
    <template #headRight>
      <el-select class="business-server__select" v-model="selectedCategory" filterable placeholder="请选择分类">
        <el-option v-for="(item, index) in categories" :key="index" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-select class="business-server__select" v-model="selectedTag" filterable placeholder="请选择标签">
        <el-option v-for="(item, index) in tags" :key="index" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-input
        class="business-server__input"
        placeholder="输入搜索对象名称/标签/分类"
        v-model="inputValue"
        clearable
        suffix-icon="el-icon-search"
      ></el-input>
      <el-popover placement="bottom" trigger="click">
        <template #reference>
          <el-icon class="el-icon-setting"></el-icon>
        </template>
        <el-button class="configuration-button">负责人</el-button>
        <el-button class="configuration-button">分类</el-button>
        <el-button class="configuration-button">标签</el-button>
      </el-popover>
    </template>
    <server-table
      ref="serverTableRef"
      :data="serveList.list"
      :columns="tableColumns"
      :operations="tableOperations"
      @delete="deleteColum"
      @edit="editRow"
      @build="buildRow"
      @initialize="initRow"
    >
      <!-- 服务名称栏 -->
      <template #name="{ rowData }">
        <router-link :to="`/service/business-edit/${rowData.id}`">{{ rowData.name }}</router-link>
      </template>
      <!-- 仓库地址栏 -->
      <template #deposit="{ rowData }">
        <a :href="rowData.deposit">{{ rowData.deposit }}</a>
      </template>
      <!-- 自定义负责人栏显示样式 -->
      <template #owner="data">
        <el-tag v-if="data.owner">{{ data.owner }}</el-tag>
      </template>
      <!-- 自定义服务状态栏显示样式 -->
      <template #status="data">
        <div>{{ data.status }}</div>
      </template>
      <!-- 自定义代码质量栏显示样式 -->
      <template #qualtity="data">
        <div @click="openCodeQualtity(data)">代码质量</div>
      </template>
      <!-- 自定义服务代码栏显示样式 -->
      <template #code="data">
        <el-button v-if="data.code" type="primary" icon="el-icon-download">{{ data.code }}</el-button>
      </template>
    </server-table>
  </data-list>
  <el-dialog title="服务克隆" v-model="cloneDialogVisible" width="1000px" destroy-on-close>
    <clone-dialog></clone-dialog>
  </el-dialog>
</template>

<script lang="ts">
import { reactive, toRefs, ref, nextTick } from 'vue';
import ServerTable from '@/components/packaged-table/PackagedTable.vue';
import { useRouter } from 'vue-router';
import { tableColumns, tableOperations } from './config/business-server-config';
import CloneDialog from '@/views/servers-management/business-serve-tools/Clone.vue';
import {
  getServeListForTable,
  serveList,
  deleteServe,
} from '@/views/servers-management/business-serve-tools/serve-data-utils';
import { buildService, initService } from '@/api/servers';
import { ElMessage, ElLoading } from 'element-plus';

interface CategoryStateInterface {
  categories: Array<Record<string, any>>;
  selectedCategory: string;
}

interface TagStateInterface {
  tags: Array<Record<string, any>>;
  selectedTag: string;
}

interface TableStateInterface {
  tableData: Array<Record<string, any>>;
  tableColumns: Array<Record<string, any>>;
  tableOperations: Array<Record<string, any>>;
}

export default {
  components: {
    ServerTable,
    CloneDialog,
  },
  setup() {
    const serverTableRef: any = ref(null);
    const router = useRouter();
    // 分类相关状态
    const categoryState: CategoryStateInterface = reactive({
      categories: [],
      selectedCategory: '',
    });

    // 标签相关状态
    const tagState: TagStateInterface = reactive({
      tags: [],
      selectedTag: '',
    });

    // 搜索框输入
    const inputValue = ref('');

    // 表格相关状态
    const tableState: TableStateInterface = reactive({
      tableData: [],
      tableColumns: [],
      tableOperations: [],
    });

    tableState.tableColumns = tableColumns || [];

    tableState.tableOperations = tableOperations || [];

    // 打开代码质量弹窗
    function openCodeQualtity(scope: any) {
      console.log(scope);
    }

    const cloneDialogVisible = ref(false);
    const goCreatePage = () => {
      router.push({ path: '/service/business-add' });
    };
    const currentPage = ref(1);
    const pageSize = ref(10);
    const reloadList = () => {
      getServeListForTable(currentPage.value, pageSize.value);
    };
    const getPageChange = (obj: any) => {
      obj.key === 'page' ? (currentPage.value = obj.value) : (pageSize.value = obj.value);
      reloadList();
    };
    const deleteColum = (obj: any) => {
      deleteServe(obj.id).then(() => {
        reloadList();
      });
    };
    reloadList();

    const editRow = (index: number, obj: any) => {
      router.push({ path: `/service/business-edit/${obj.id}` });
    };
    const buildRow = async (index: number, obj: any) => {
      const { code } = await buildService({
        serviceId: obj.id,
        branch: 'master',
      });
      if (!code) return;
      ElMessage.success('成功开始构建！');
    };
    const initRow = async (index: number, obj: any) => {
      const loadingInstance = ElLoading.service();
      const res = await initService({
        serviceId: obj.id,
      });
      nextTick(() => {
        loadingInstance.close();
      });
      if (!res || res.code) return;
      ElMessage.success('成功初始化！');
    };
    return {
      ...toRefs(categoryState),
      ...toRefs(tagState),
      ...toRefs(tableState),
      serverTableRef,
      inputValue,
      openCodeQualtity,
      cloneDialogVisible,
      serveList,
      goCreatePage,
      currentPage,
      pageSize,
      getPageChange,
      deleteColum,
      editRow,
      initRow,
      buildRow,
    };
  },
};
</script>

<style lang="scss" scoped>
.configuration-button {
  width: 125px;
  margin-bottom: 10px;
  margin-left: 0;
}
.business-server {
  &__select {
    margin-right: 10px;
  }
  &__input {
    margin-right: 10px;
    width: 260px;
  }
}
</style>
