<template>
  <el-dialog title="高级设置" v-model="visible" width="640px" :before-close="handleClose">
    <div class="dialog-body">
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="默认值" prop="defaultValue">
          <el-input-number
            v-model="form.defaultValue"
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
            :min="min"
            :max="max"
            placeholder="请输入最大值限制"
            v-if="isEdit"
          ></el-input-number>
          <span v-else>{{ typeof form.max === 'undefined' ? '--' : form.max }}</span>
        </el-form-item>
        <el-form-item label="精度限制" prop="precision">
          <template v-slot:label
            >精度限制
            <el-tooltip effect="light" content="小数点后最大位数限制" placement="top">
              <i class="el-icon-question info-icon form-item__tooltip_icon"></i>
            </el-tooltip>
          </template>
          <el-input-number
            v-model="form.precision"
            :min="0"
            :max="10"
            placeholder="请输入精度限制"
            v-if="isEdit"
          ></el-input-number>
          <span v-else>{{ typeof form.precision === 'undefined' ? '--' : form.precision }}</span>
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
import { computed, defineComponent, reactive } from 'vue';
import Base from './Base';
const { handleSubmit, source, form, ...baseApi } = Base();

const FLOAT_RANGE = [-3.4e38, 3.4e38];
const DOUBLE_RANGE = [-1.79e308, 1.79e308];
export default defineComponent({
  name: 'FloatSettingDialog',
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
      min: [{ validator: checkMin, trigger: 'blur' }],
      max: [{ validator: checkMax, trigger: 'blur' }],
      precision: [],
    });

    const min = computed(() => {
      if (source.value.type === 'Float') {
        return FLOAT_RANGE[0];
      }
      return DOUBLE_RANGE[0];
    });

    const max = computed(() => {
      if (source.value.type === 'Float') {
        return FLOAT_RANGE[1];
      }
      return DOUBLE_RANGE[1];
    });

    return {
      formRules,
      ...baseApi,
      form,
      source,
      min,
      max,
      handleSubmit: () => {
        handleSubmit(emit);
      },
    };
  },
});
</script>
