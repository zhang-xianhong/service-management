<template>
  <el-dialog title="高级设置" v-model="visible" width="640px" :before-close="handleClose">
    <div class="dialog-body">
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="默认值" prop="defaultValue">
          <el-input-number v-model="form.defaultValue" placeholder="请输入默认值" v-if="isEdit"></el-input-number>
          <span v-else>{{ form.defaultValue }}</span>
        </el-form-item>
        <el-form-item label="最小值限制" prop="min">
          <el-input-number v-model="form.min" placeholder="请输入最小值限制" v-if="isEdit"></el-input-number>
          <span v-else>{{ form.min }}</span>
        </el-form-item>
        <el-form-item label="最大值限制" prop="max">
          <el-input-number v-model="form.max" placeholder="请输入最大值限制" v-if="isEdit"></el-input-number>
          <span v-else>{{ form.max }}</span>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSubmit" :loading="submitting" v-if="isEdit">确定</el-button>
        <el-button @click="handleClose">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue';
import Base from './Base';
const { handleSubmit, form, ...baseApi } = Base();
export default defineComponent({
  name: 'IntSettingDialog',
  setup(props, { emit }) {
    const formRules = reactive({
      defaultValue: [],
      minlength: [],
      maxlength: [],
      pattern: [],
    });
    return {
      form,
      formRules,
      ...baseApi,
      handleSubmit: () => {
        handleSubmit(emit);
      },
    };
  },
});
</script>
