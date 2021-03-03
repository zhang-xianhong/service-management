<template>
  <data-list>
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
    <server-table :data="serveList" :columns="tableColumns" :operations="tableOperations">
      <!-- 服务名称栏 -->
      <template #name="{ rowData }">
        <router-link :to="`/serve/business-edit/${rowData.id}`">{{ rowData.name }}</router-link>
      </template>
      <!-- 自定义负责人栏显示样式 -->
      <template #owner="data">
        <el-tag>{{ data.owner }}</el-tag>
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
        <el-button type="primary" icon="el-icon-download">{{ data.code }}</el-button>
      </template>
    </server-table>
  </data-list>
  <el-dialog title="服务克隆" v-model="cloneDialogVisible" width="1000px" destroy-on-close>
    <clone-dialog></clone-dialog>
  </el-dialog>
</template>

<script lang="ts">
import { reactive, toRefs, ref } from 'vue';
import ServerTable from '@/components/packaged-table/PackagedTable.vue';
import { useRouter } from 'vue-router';
import { tableColumns, tableOperations } from './config/business-server-config';
import CloneDialog from '@/views/servers/business-serve-dialog/Clone.vue';
import { getServeList, serveList } from '@/views/servers/business-serve-dialog/form-data';

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

    tableState.tableData.push({
      id: 1,
      name: '李三',
      desc: '码农',
      owner: '老板',
      status: '运行中_2021-02-26 09:51:02_0',
      code: ' git@106.55.94.55:tencent-citybase/ProjectDocumentsSvc.git',
      address: 'http://42.194.218.202:21351/swagger-ui.html',
      druid: 'http://42.194.218.202:21351/swagger-ui.html',
    });

    tableState.tableColumns = tableColumns || [];

    tableState.tableOperations = tableOperations || [];

    // 打开代码质量弹窗
    function openCodeQualtity(scope: any) {
      console.log(scope);
    }

    getServeList(1, 5);
    const cloneDialogVisible = ref(false);
    const goCreatePage = () => {
      router.push({ path: '/serve/business-add' });
    };

    return {
      ...toRefs(categoryState),
      ...toRefs(tagState),
      ...toRefs(tableState),
      inputValue,
      openCodeQualtity,
      cloneDialogVisible,
      serveList,
      goCreatePage,
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
