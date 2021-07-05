<template>
  <el-dialog title="发版" v-model="releaseDialogVisible" width="1000px" @close="closeDialog">
    <div>
      <el-steps :active="currentActive" finish-status="success" simple>
        <el-step v-for="item in tabMenuData" :key="item.title" :title="item.title"></el-step>
      </el-steps>
    </div>
    <div class="release-container">
      <el-form
        :model="baseFormData"
        :rules="baseFormRules"
        ref="releaseBaseForm"
        label-width="100px"
        class="demo-ruleForm"
        v-show="tabMenuData[currentActive].id === 'baseInfo'"
      >
        <el-form-item label="版本" prop="version">
          <el-input v-model="baseFormData.version"></el-input>
        </el-form-item>
        <el-form-item label="发版说明" prop="description">
          <el-input type="textarea" v-model="baseFormData.description"></el-input>
        </el-form-item>
      </el-form>
      <el-table
        ref="tableRef"
        v-show="tabMenuData[currentActive].id === 'config'"
        :data="configTableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column type="index" label="序号" width="50"> </el-table-column>
        <el-table-column label="配置来源" width="100">
          <template #default="scope">{{ ConfigOrigin[scope.row.scope] }}</template>
        </el-table-column>
        <el-table-column prop="name" label="键"> </el-table-column>
        <el-table-column prop="defaultValue" label="默认值"> </el-table-column>
        <el-table-column prop="type" label="类型" width="100">
          <template #default="scope">{{ ConfigType[scope.row.type] }}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="dialog-footer">
      <el-button type="primary" style="margin-top: 20px" @click="releaseNext">下一步</el-button>
      <el-button style="margin-top: 20px" @click="closeDialog">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, getCurrentInstance, onMounted } from 'vue';
import { getServiceConfig } from '@/api/servers';
// 状态码
enum ResCode {
  Success,
}

// 配置来源
enum ConfigOrigin {
  '服务配置',
  '项目配置',
  '通用配置',
}

// 类型
enum ConfigType {
  '应用类型',
  '系统类型',
}

export default defineComponent({
  name: 'ReleaseDialog',
  components: {
    // BaseInfo,
    // Config,
    // UpgradeScript,
    // PreData,
  },
  setup() {
    const tabMenuData = [
      {
        title: '基本信息',
        id: 'baseInfo',
      },
      {
        title: '配置项',
        id: 'config',
      },
      {
        title: '数据库升级脚本',
        id: 'upgradeScript',
      },
      {
        title: '数据库预置数据',
        id: 'preScript',
      },
    ];
    // 获取组件实例
    const instance = getCurrentInstance();
    // 提示信息
    function msgTips(type: string, content: string) {
      (instance as any).proxy.$message({
        type,
        message: content,
      });
    }

    // 基础信息
    const baseFormData = reactive({
      version: '',
      description: '',
    });
    const baseFormRules = {
      version: [
        { required: true, message: '请输入版本号', trigger: 'blur' },
        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
      ],
      description: [
        { required: true, message: '请输入使用注意事项，更新日志，版本信息、bug修复记录', trigger: 'blur' },
        { min: 1, max: 225, message: '长度在 1 到 225 个字符', trigger: 'blur' },
      ],
    };

    // 配置数据
    const configTableData: any = ref([]);
    const tableRef: any = ref(null);
    // 获取配置列表
    const getConfigList = async () => {
      try {
        const { code, data } = await getServiceConfig({ id: '' });
        if (code === ResCode.Success) {
          configTableData.value = data;
          // 更改选中
          console.log('tableRef.value', tableRef.value);
          tableRef.value.toggleRowSelection(configTableData.value[0], true);
        } else {
          msgTips('error', '获取人员列表失败');
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    onMounted(() => {
      getConfigList();
    });

    const handleSelectionChange = (data: any) => {
      console.log('data', data);
    };

    const releaseDialogVisible = ref(false);
    // 当前step
    const currentActive = ref(0);

    // 下一步
    const releaseNext = () => {
      if (currentActive.value < 4) {
        currentActive.value = currentActive.value + 1;
      }
    };

    // 打开dialog
    const openDialog = () => {
      releaseDialogVisible.value = true;
    };

    // 关闭dialog
    const closeDialog = () => {
      releaseDialogVisible.value = false;
    };
    const dynamicComp = ['BaseInfo', 'Config', 'UpgradeScript', 'PreData'];
    const currentTabComponent = ref(0);
    return {
      releaseDialogVisible,
      baseFormData,
      baseFormRules,
      currentActive,
      tabMenuData,
      openDialog,
      closeDialog,
      releaseNext,
      currentTabComponent,
      dynamicComp,
      configTableData,
      handleSelectionChange,
      ConfigOrigin,
      ConfigType,
      tableRef,
    };
  },
});
</script>
<!-- <keep-alive>
        <component :is="dynamicComp[currentActive]"> </component>
      </keep-alive> -->
<style scoped>
.release-container {
  padding: 30px 0;
}
.el-steps--simple {
  padding: 10px 0;
}
</style>
