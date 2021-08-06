<template>
  <el-dialog title="高级设置" v-model="visible" width="640px" :before-close="handleClose">
    <div class="dialog-body">
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="默认值" prop="defaultValue">
          <el-input-number
            v-model="form.defaultValue"
            :precision="0"
            :step="1"
            :min="min"
            :max="max"
            placeholder="请输入默认值"
            v-if="isEdit"
          ></el-input-number>
          <span v-else>{{ typeof form.defaultValue === 'undefined' ? '--' : form.defaultValue }}</span>
        </el-form-item>
        <el-form-item label="最小值限制" prop="min">
          <el-input-number
            v-model="form.min"
            :precision="0"
            :step="1"
            :min="min"
            :max="max"
            placeholder="请输入最小值限制"
            v-if="isEdit"
          ></el-input-number>
          <span v-else>{{ typeof form.min === 'undefined' ? '--' : form.min }}</span>
        </el-form-item>
        <el-form-item label="最大值限制" prop="max">
          <el-input-number
            v-model="form.max"
            :precision="0"
            :step="1"
            :min="min"
            :max="max"
            placeholder="请输入最大值限制"
            v-if="isEdit"
          ></el-input-number>
          <span v-else>{{ typeof form.max === 'undefined' ? '--' : form.max }}</span>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSubmit" :loading="submitting" v-if="isEdit">确定</el-button>
        <el-button @click="handleClose">{{ isEdit ? '取消' : '关闭' }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';
import Base from './Base';
const { handleSubmit, form, source, ...baseApi } = Base();

const INT32_RANGE = [-2147483648, 2147483647];
const INT64_RANGE = [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];

export default defineComponent({
  name: 'IntSettingDialog',
  setup(props, { emit }) {
    const checkMin = (rule: any, value: any, callback: any) => {
      if ((form.max || Number(form.max) === 0) && (value || Number(value) === 0)) {
        if (value > form.max) {
          callback(new Error('最小值不能大于最大值'));
          return;
        }
      }
      callback();
    };

    const checkMax = (rule: any, value: any, callback: any) => {
      if ((form.min || Number(form.min) === 0) && (value || Number(value) === 0)) {
        if (value < form.min) {
          callback(new Error('最大值不能小于最小值'));
          return;
        }
      }
      callback();
    };

    const formRules = reactive({
      defaultValue: [],
      min: [{ validator: checkMin, trigger: 'change' }],
      max: [{ validator: checkMax, trigger: 'change' }],
    });

    const min = computed(() => {
      if (source.value.type === 'Int32') {
        return INT32_RANGE[0];
      }
      return INT64_RANGE[0];
    });

    const max = computed(() => {
      if (source.value.type === 'Int32') {
        return INT32_RANGE[1];
      }
      return INT64_RANGE[1];
    });
    return {
      form,
      formRules,
      source,
      ...baseApi,
      handleSubmit: () => {
        handleSubmit(emit);
      },
      min,
      max,
    };
  },
});
</script>
