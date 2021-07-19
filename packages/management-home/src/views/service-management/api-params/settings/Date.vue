<template>
  <el-dialog title="高级设置" v-model="visible" width="640px" :before-close="handleClose">
    <div class="dialog-body">
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="类型选择" prop="type">
          <el-radio name="set-date-type" v-model="form.type" :label="1">时间戳格式</el-radio>
          <el-radio name="set-date-type" v-model="form.type" :label="2">时间格式</el-radio>
        </el-form-item>
        <el-form-item label="格式限制" prop="format" v-if="form.type === 2">
          <el-input v-model.trim="form.format" placeholder="请输入格式限制" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
        <el-button @click="handleClose">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
export default defineComponent({
  name: 'DateSettingDialog',
  components: {},
  setup() {
    const visible = ref(false);
    const submitting = ref(false);
    const formRef = ref(null as any);
    const sourceData = ref(null as any);
    const form = reactive({
      type: 1,
      format: '',
    });

    const formRules = reactive({
      type: [],
      format: [],
    });
    const handleClose = () => {
      visible.value = false;
      formRef.value.resetFields();
    };
    const handleOpen = (row: any) => {
      sourceData.value = row;
      visible.value = true;
      submitting.value = false;
    };
    const handleSubmit = async () => {
      try {
        submitting.value = true;
        const valid = await formRef.value.validate();
        if (!valid) {
          return;
        }

        ElMessage.success('设置成功');
        handleClose();
      } catch (e) {
        console.log(e);
      } finally {
        submitting.value = false;
      }
    };
    return {
      visible,
      submitting,
      form,
      formRules,
      formRef,
      handleOpen,
      handleClose,
      handleSubmit,
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
  ::v-deep .el-input-number {
    width: 200px;
  }
}
</style>
