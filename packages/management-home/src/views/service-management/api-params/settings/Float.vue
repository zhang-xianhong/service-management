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
            max="10"
            placeholder="请输入精度限制"
            v-if="isEdit"
          ></el-input-number>
          <span v-else>{{ form.precision }}</span>
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
import { defineComponent, reactive } from 'vue';
import Base from './Base';
const { handleSubmit, ...baseApi } = Base();
export default defineComponent({
  name: 'FloatSettingDialog',
  setup(props, { emit }) {
    const formRules = reactive({
      defaultValue: [],
      minlength: [],
      maxlength: [],
      pattern: [],
    });
    return {
      formRules,
      ...baseApi,
      handleSubmit: () => {
        handleSubmit(emit);
      },
    };
  },
});
</script>
