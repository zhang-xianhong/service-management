<template>
  <el-dialog title="发版" v-model="releaseDialogVisible" width="1000px" @close="closeDialog" destroy-on-close>
    <div class="release-steps">
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
        v-show="tabMenuData[currentActive].id === 'baseInfo'"
      >
        <el-form-item label="版本" prop="serviceVersion">
          <el-input v-model="baseFormData.serviceVersion"></el-input>
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

      <CodeEditor v-model="baseFormData.ddlScript" v-show="tabMenuData[currentActive].id === 'upgradeScript'" />

      <CodeEditor v-model="baseFormData.dmlScript" v-show="tabMenuData[currentActive].id === 'preScript'" />
    </div>
    <div class="dialog-footer">
      <el-button style="margin-top: 20px" @click="releasePrev" v-show="currentActive > 0">上一步</el-button>
      <el-button type="primary" @click="releaseNext" v-show="currentActive < 3">下一步</el-button>
      <el-button type="primary" @click="finished" v-show="currentActive === 3" :loading="finishing">完成</el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, getCurrentInstance, Ref, nextTick } from 'vue';
import { getServiceConfig, releaseService } from '@/api/servers';
import CodeEditor from '@/components/sql-editor/Index.vue';
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
interface RefType {
  [attr: string]: any;
}
// 发版说明  版本号必须只能包含英文字母、数字、西文点号、西文“-”， 西文“_”，且长度限制在1~20个西文字符。
const regDes = /^[A-Za-z\d（.\-_)]{1,20}$/;
// 密码校验
const validatorVersionPass = (rule: any, value: string, callback: Function) => {
  if (!regDes.test(value)) {
    callback(new Error('版本号必须只能包含英文字母、数字、西文点号、西文“-”， 西文“_”，且长度限制在1~20个西文字符'));
  }
  callback();
};
export default defineComponent({
  name: 'ReleaseDialog',
  components: { CodeEditor },
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
    const releaseBaseForm: Ref<RefType | any> = ref(null);
    const finishing: Ref<boolean> = ref(false);
    // 获取组件实例
    const instance = getCurrentInstance();
    // 提示信息
    function msgTips(type: string, content: string) {
      (instance as any).proxy.$message({
        type,
        message: content,
      });
    }
    let serviceId: any = '';
    // 发版数据
    const baseFormData = reactive({
      serviceVersion: '',
      description: '',
      configTemplates: [],
      ddlScript: '',
      dmlScript: '',
    });
    const baseFormRules = {
      serviceVersion: [
        { required: true, message: '请输入版本号', trigger: 'blur' },
        { validator: validatorVersionPass, trigger: 'blur' },
      ],
      description: [
        { required: true, message: '请输入使用注意事项，更新日志，版本信息、bug修复记录', trigger: 'blur' },
        { min: 1, max: 2048, message: '长度在 1 到 2048 个字符', trigger: 'blur' },
      ],
    };

    // 配置数据
    const configTableData: any = ref([]);
    const tableRef: any = ref(null);
    // 获取配置列表
    const getConfigList = async (id: any) => {
      try {
        const { code, data } = await getServiceConfig(id);
        if (code === ResCode.Success) {
          configTableData.value = data;
        } else {
          msgTips('error', '获取人员列表失败');
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    const handleSelectionChange = (data: any) => {
      baseFormData.configTemplates = data.map((item: any) => ({
        name: item.name,
        value: item.defaultValue,
      }));
    };

    const releaseDialogVisible = ref(false);
    // 当前step
    const currentActive = ref(0);

    // 上一步
    const releasePrev = () => {
      if (currentActive.value > 0) {
        currentActive.value = currentActive.value - 1;
      }
    };

    // 下一步
    const releaseNext = async () => {
      if (currentActive.value === 0) {
        // 增加校验
        releaseBaseForm.value.validate((valid: boolean) => {
          if (valid) {
            currentActive.value = currentActive.value + 1;
            // const defaultSelConfig: any = configTableData.value.filter(
            //   (item: any) => item.scope === ConfigOrigin['通用配置'],
            // );
            // // 自动选中系统配置
            // defaultSelConfig.forEach((item: any) => {
            //   tableRef.value.toggleRowSelection(item);
            // });
          }
        });
        await nextTick();
      } else if (currentActive.value < 4) {
        currentActive.value = currentActive.value + 1;
      }
    };

    // 打开dialog
    const openDialog = (id: any) => {
      releaseDialogVisible.value = true;
      serviceId = id;
      getConfigList(serviceId);
    };

    // 初始化
    const init = () => {
      currentActive.value = 0;
      baseFormData.serviceVersion = '';
      baseFormData.description = '';
      baseFormData.configTemplates = [];
      baseFormData.ddlScript = '';
      baseFormData.dmlScript = '';
      configTableData.value = [];
    };

    // 关闭dialog
    const closeDialog = () => {
      init();
      releaseDialogVisible.value = false;
    };

    // 完成
    const finished = async () => {
      finishing.value = true;
      try {
        const data = {
          ...baseFormData,
          serviceId,
        };
        // 发版
        const { code } = await releaseService(data);
        if (code === ResCode.Success) {
          finishing.value = false;
          msgTips('success', '发版成功！');
          // 关闭dialog
          closeDialog();
        } else {
          msgTips('error', '发版失败！');
        }
      } catch (error) {
        finishing.value = false;
        console.log('error', error);
      }
    };
    return {
      releaseDialogVisible,
      baseFormData,
      baseFormRules,
      currentActive,
      tabMenuData,
      openDialog,
      closeDialog,
      releaseNext,
      configTableData,
      handleSelectionChange,
      ConfigOrigin,
      ConfigType,
      tableRef,
      releasePrev,
      finished,
      releaseBaseForm,
      finishing,
    };
  },
});
</script>
<style lang="scss" scoped>
.release-container {
  padding: 30px 0;
}
.el-steps--simple {
  padding: 10px 0;
}
.release-steps {
  ::v-deep {
    .el-step__line {
      display: none;
    }
  }
}
</style>
