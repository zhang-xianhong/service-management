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
import { defineComponent, reactive } from 'vue';
import Base from './Base';
const { visible, submitting, formRef, form, handleClose, handleOpen, handleSubmit } = Base();
export default defineComponent({
  name: 'BooleanSettingDialog',
  setup(props, { emit }) {
    const formRules = reactive({
      defaultValue: [],
      minlength: [],
      maxlength: [],
      pattern: [],
    });
    return {
      visible,
      submitting,
      form,
      formRules,
      formRef,
      handleOpen,
      handleClose,
      handleSubmit: () => {
        handleSubmit(emit);
      },
    };
  },
});
</script>
