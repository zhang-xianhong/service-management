<template>
  <el-dialog title="高级设置" v-model="visible" width="640px" :before-close="handleClose">
    <div class="dialog-body">
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="默认值" prop="defaultValue">
          <el-select v-model="form.defaultValue">
            <el-option label="True" :value="1">True</el-option>
            <el-option label="False" :value="0">False</el-option>
          </el-select>
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
  name: 'BooleanSettingDialog',
  components: {},
  setup() {
    const visible = ref(false);
    const submitting = ref(false);
    const formRef = ref(null as any);
    const sourceData = ref(null as any);
    const form = reactive({
      defaultValue: 1,
    });

    const formRules = reactive({
      defaultValue: [],
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
