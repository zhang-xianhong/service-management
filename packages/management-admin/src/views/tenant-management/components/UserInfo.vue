<template>
  <el-row>企业联系人信息</el-row>
  <el-row style="padding:0px 20px;">
    <el-form
      ref="formRef"
      class="userinfo-form"
      :model="userInfo"
      :rules="rules"
      inline
      label-width="140px"
      label-position="left"
    >
      <el-form-item prop="name" class="form-item" label="联系人姓名" required>
        <template v-if="isEdit">{{ userInfo.name }}</template>
        <el-input v-else v-model="userInfo.name" style="width: 400px" placeholder="请输入联系人中文姓名"></el-input>
      </el-form-item>
      <el-form-item prop="phone" class="form-item" label="联系人电话" required>
        <el-input v-model="userInfo.phone" style="width: 400px" placeholder="请输入联系人电话"></el-input>
      </el-form-item>
      <el-form-item prop="IDCard" class="form-item" label="联系人身份证号" required>
        <el-input v-model="userInfo.IDCard" style="width: 400px" placeholder="请输入联系人身份证号"></el-input>
      </el-form-item>
      <el-form-item prop="email" class="form-item" label="联系人邮箱" required>
        <el-input v-model="userInfo.email" style="width: 400px" placeholder="请输入联系人邮箱"></el-input>
      </el-form-item>
      <el-form-item prop="frontPhoto" class="form-item" label="身份证正面" required>
        <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false">
          <img v-if="userInfo.frontPhoto" :src="userInfo.frontPhoto" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item prop="reversePhoto" class="form-item" label="身份证反面" required>
        <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false">
          <img v-if="userInfo.reversePhoto" :src="userInfo.reversePhoto" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
  </el-row>
  <el-row>
    <el-button @click="goPreviousStep">上一步</el-button>
    <el-button type="primary" @click="goNextStep">下一步</el-button>
  </el-row>
</template>

<script lang="ts">
import { computed, ref, SetupContext, WritableComputedRef } from 'vue';

interface UserInfoInterface {
  name: string;
  phone: string;
  IDCard: string;
  email: string;
  frontPhoto: string;
  reversePhoto: string;
}

export default {
  name: 'UserInfo',
  emits: ['go', 'update:modelValue'],
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props: { isEdit: boolean; modelValue: any }, ctx: SetupContext) {
    const formRef: any = ref(null);
    // 联系人信息
    const userInfo: WritableComputedRef<UserInfoInterface> = computed({
      get: () => props.modelValue?.contact || {},
      set: (newValue: any) => {
        ctx.emit('update:modelValue', newValue);
      },
    });

    // 表单校验规则
    const rules = {
      name: [
        { required: true, message: '请输入联系人中文姓名' },
        { min: 3, max: 20, message: '联系人姓名长度在2到40个字符之间', trigger: 'blur' },
        { pattern: /^[\u4e00-\u9fa5]+$/g, message: '联系人姓名仅支持中文', trigger: 'blur' },
      ],
      phone: [
        { required: true, message: '请输入联系人电话' },
        { pattern: /^\d{11}$/g, message: '联系人电话输入格式不合法，请重新输入', trigger: 'blur' },
      ],
      IDCard: [
        { required: true, message: '请输入联系人身份证号' },
        { pattern: /^[0-9|X]+$/g, message: '联系人电话输入格式不合法，请重新输入', trigger: 'blur' },
      ],
      email: [
        { required: true, message: '请输入联系人邮箱' },
        {
          pattern: /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/g,
          message: '联系人邮箱输入格式不合法，请重新输入',
          trigger: 'blur',
        },
      ],
      frontPhoto: [{ required: true, message: '请上传身份证正面' }],
      reversePhoto: [{ required: true, message: '请上传身份证反面' }],
    };

    // 点击前往上一步
    const goPreviousStep = () => {
      ctx.emit('go', 1);
    };

    // 点击跳往下一步
    const goNextStep = () => {
      formRef.value.validate(async (validator: boolean) => {
        if (validator) {
          ctx.emit('go', 3);
        }
      });
    };

    return {
      formRef,
      userInfo,
      rules,
      goPreviousStep,
      goNextStep,
    };
  },
};
</script>

<style scoped>
.userinfo-form {
  width: 100%;
}
</style>
