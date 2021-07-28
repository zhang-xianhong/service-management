<template>
  <el-dialog title="高级设置" v-model="visible" width="640px" :before-close="handleClose">
    <div class="dialog-body">
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="默认值" prop="defaultValue">
          <el-input v-model.trim="form.defaultValue" placeholder="请输入默认值" maxlength="20" v-if="isEdit" />
          <span v-else>{{ form.defaultValue }}</span>
        </el-form-item>
        <el-form-item label="最小长度" prop="minlength">
          <el-input-number
            v-model="form.minlength"
            :min="0"
            placeholder="请输入最小长度"
            v-if="isEdit"
          ></el-input-number>
          <span v-else>{{ form.minlength }}</span>
        </el-form-item>
        <el-form-item label="最大长度" prop="maxlength">
          <el-input-number
            v-model="form.maxlength"
            :min="0"
            placeholder="请输入最大长度"
            v-if="isEdit"
          ></el-input-number>
          <span v-else>{{ form.maxlength }}</span>
        </el-form-item>
        <el-form-item label="Pattern" prop="pattern">
          <template v-slot:label
            >Pattern
            <el-tooltip effect="light" content="用正则表达式约束字符串" placement="top">
              <i class="el-icon-question info-icon form-item__tooltip_icon"></i>
            </el-tooltip>
          </template>
          <el-input v-model.trim="form.pattern" placeholder="请输入Pattern" v-if="isEdit" />
          <span v-else>{{ form.pattern }}</span>
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
const { handleSubmit, form, ...baseApi } = Base();
export default defineComponent({
  name: 'StringSettingDialog',
  setup(props, { emit }) {
    const checkMinlength = (rule: any, value: any, callback: any) => {
      const minlength = value !== undefined ? Number(value) : undefined;
      const maxlength = form.maxlength !== undefined ? Number(form.maxlength) : undefined;
      if (minlength !== undefined && maxlength !== undefined && minlength > maxlength) {
        callback(new Error('最小值不能大于最大值'));
      } else {
        callback();
      }
    };
    const checkMaxlength = (rule: any, value: any, callback: any) => {
      const maxlength = value !== undefined ? Number(value) : undefined;
      const minlength = form.maxlength !== undefined ? Number(form.maxlength) : undefined;
      if (minlength !== undefined && maxlength !== undefined && minlength > maxlength) {
        callback(new Error('最大值不能小于最小值'));
      } else {
        callback();
      }
    };
    const formRules = reactive({
      defaultValue: [],
      minlength: [{ validator: checkMinlength, trigger: 'blur' }],
      maxlength: [{ validator: checkMaxlength, trigger: 'blur' }],
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
