<template>
  <el-dialog title="共享服务" v-model="visible" width="640px" :before-close="handleClose">
    <div class="dialog-body">
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="共享方式" prop="platformShareType">
          <el-select v-model="form.platformShareType" multiple placeholder="请选择共享方式" style="width: 100%">
            <el-option
              v-for="item in sharedTypes"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="英文服务名">
          <span v-if="sourceData">{{ sourceData.serviceName }}</span>
        </el-form-item>
        <el-form-item label="中文服务名">
          <span v-if="sourceData && sourceData.snapshotInfo">{{ sourceData.snapshotInfo.serviceNameZh }}</span>
        </el-form-item>
        <el-form-item label="服务依赖">
          <el-button type="text" @click="handleViewServiceDepend">查看详情</el-button>
        </el-form-item>
        <el-form-item label="共享说明" prop="platformShareDescription">
          <el-input
            type="textarea"
            placeholder="请输入共享说明"
            :rows="4"
            v-model="form.platformShareDescription"
            maxlength="1024"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
        <el-button @click="handleClose">取消</el-button>
      </span>
    </template>
    <service-depend-dialog ref="serviceDependDialog" />
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import ServiceDependDialog from './Depend.vue';
export default defineComponent({
  name: 'SharedDialog',
  components: {
    ServiceDependDialog,
  },
  setup() {
    const visible = ref(false);
    const submitting = ref(false);
    const formRef = ref(null as any);
    const serviceDependDialog = ref(null as any);
    const sourceData = ref(null as any);
    const form = reactive({
      shareType: [],
      remark: '',
    });
    const sharedTypes = reactive([
      {
        value: 1,
        label: '克隆',
      },
      {
        value: 2,
        label: '引用',
      },
    ]);
    const formRules = reactive({
      platformShareType: [{ required: true, message: '请选择共享方式', trigger: 'blur' }],
      platformShareDescription: [{ max: 1024, message: '最多输入1024个字符', trigger: 'blur' }],
    });
    const handleClose = () => {
      visible.value = false;
      formRef.value.resetFields();
    };
    const handleOpen = (row: any) => {
      sourceData.value = row;
      visible.value = true;
    };
    const handleSubmit = async () => {
      try {
        submitting.value = true;
        const valid = await formRef.value.validate();
        if (!valid) {
          return;
        }
        console.log(form);
        handleClose();
      } catch (e) {
        console.log(e);
      } finally {
        submitting.value = false;
      }
    };
    const handleClearValidate = () => {
      formRef.value.clearValidate(['serviceName', 'serviceNameZh']);
    };
    const handleViewServiceDepend = () => {
      serviceDependDialog.value.handleOpen();
    };
    return {
      visible,
      submitting,
      form,
      formRules,
      formRef,
      serviceDependDialog,
      handleOpen,
      handleClose,
      handleSubmit,
      handleClearValidate,
      handleViewServiceDepend,
      sharedTypes,
      sourceData,
    };
  },
});
</script>
<style lang="scss" scoped>
.dialog-body {
  ::v-deep .el-input__inner {
    width: 100%;
  }
}
</style>
