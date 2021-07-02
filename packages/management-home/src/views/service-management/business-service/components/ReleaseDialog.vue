<template>
  <el-dialog title="发版" v-model="releaseDialogVisible" width="60%" @close="closeDialog">
    <div>
      <el-steps :active="currentActive" finish-status="success" simple style="margin-top: 20px">
        <el-step v-for="item in releaseFormData" :key="item.title" :title="item.title"></el-step>
      </el-steps>
    </div>
    <div>
      <keep-alive>
        <component :is="dynamicComp[currentActive]"> </component>
      </keep-alive>
    </div>
    <div class="dialog-footer">
      <el-button type="primary" style="margin-top: 20px" @click="releaseNext">下一步</el-button>
      <el-button style="margin-top: 20px" @click="closeDialog">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import BaseInfo from './BaseInfo.vue';
import Config from './Config.vue';
import UpgradeScript from './UpgradeScript.vue';
import PreData from './PreData.vue';

export default defineComponent({
  name: 'ReleaseDialog',
  components: {
    BaseInfo,
    Config,
    UpgradeScript,
    PreData,
  },
  setup() {
    const releaseFormData = reactive([
      {
        title: '基本信息',
        id: 'baseInfo',
        rules: {
          version: [
            { required: true, message: '请输入版本号', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
          ],
          description: [
            { required: true, message: '请输入使用注意事项，更新日志，版本信息、bug修复记录', trigger: 'blur' },
          ],
        },
        data: {
          version: '',
          description: '',
        },
      },
      {
        title: '配置项',
        id: 'config',
        data: {
          version: '',
          description: '',
        },
      },
      {
        title: '数据库升级脚本',
        id: 'upgradeScript',
        data: {
          description: '',
        },
      },
      {
        title: '数据库预置数据',
        id: 'preScript',
        data: {
          description: '',
        },
      },
    ]);

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
      releaseFormData,
      currentActive,
      openDialog,
      closeDialog,
      releaseNext,
      currentTabComponent,
      dynamicComp,
    };
  },
});
</script>
