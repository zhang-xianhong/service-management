<template>
  <el-row style="font-weight: bolder">企业联系人信息</el-row>
  <el-row>
    <el-form
      ref="formRef"
      :rules="rules"
      class="userinfo-form"
      :model="userInfo"
      inline
      label-width="140px"
      label-position="left"
    >
      <el-form-item prop="name" class="form-item" label="联系人姓名">
        <template v-if="isEdit">{{ userInfo.name }}</template>
        <el-input
          v-else
          v-model="userInfo.name"
          style="width: 400px"
          placeholder="请输入联系人中文姓名"
          maxlength="20"
        ></el-input>
      </el-form-item>
      <el-form-item prop="phone" class="form-item" label="联系人电话">
        <template v-if="isEdit">{{ userInfo.phone }}</template>
        <el-input v-else v-model="userInfo.phone" style="width: 400px" placeholder="请输入联系人电话"></el-input>
      </el-form-item>
      <el-form-item prop="IDCard" class="form-item" label="联系人身份证号">
        <template v-if="isEdit">{{ userInfo.IDCard }}</template>
        <el-input v-else v-model="userInfo.IDCard" style="width: 400px" placeholder="请输入联系人身份证号"></el-input>
      </el-form-item>
      <el-form-item prop="email" class="form-item" label="联系人邮箱">
        <template v-if="isEdit">{{ userInfo.email }}</template>
        <el-input v-else v-model="userInfo.email" style="width: 400px" placeholder="请输入联系人邮箱"></el-input>
      </el-form-item>
      <el-form-item prop="frontPhoto" class="form-item" label="身份证正面">
        <img v-if="isEdit" :src="frontPhoto" class="avatar" />
        <el-upload
          v-else
          class="avatar-uploader"
          :action="IMAGE_UPLOAD"
          accept=".jpg, .bmp, .png, jpeg"
          :show-file-list="false"
          :before-upload="beforeUpload"
          @success="frontUploadSuccess"
        >
          <img v-if="frontPhoto" :src="frontPhoto" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item prop="reversePhoto" class="form-item" label="身份证反面">
        <img v-if="isEdit" :src="reversePhoto" class="avatar" />
        <el-upload
          v-else
          class="avatar-uploader"
          :action="IMAGE_UPLOAD"
          accept=".jpg, .bmp, .png, jpeg"
          :show-file-list="false"
          :before-upload="beforeUpload"
          @success="reverseUploadSuccess"
        >
          <img v-if="reversePhoto" :src="reversePhoto" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script lang="ts">
import { computed, ref, WritableComputedRef, getCurrentInstance, Ref, watch } from 'vue';
import { IMAGE_UPLOAD } from '@/shared/constant/file';
import { SuccessResponse } from '@/types/response';
import { getImageUrl } from '@/api/files';
import UserInfoInterface from '../types/user-info-interface';
const iamgeTypes = ['jpg', 'bmp', 'png', 'jpeg'];
export default {
  name: 'UserInfo',
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
  setup(props: { isEdit: boolean; modelValue: any }) {
    // 组件实例
    const instance = getCurrentInstance();

    // 表单引用
    const formRef: Ref<any> = ref(null);

    // 联系人信息
    const userInfo: WritableComputedRef<UserInfoInterface> = computed(() => props.modelValue);

    // 身份证正面
    const frontPhoto: Ref<string> = ref('');

    // 身份证反面
    const reversePhoto: Ref<string> = ref('');

    // 根据fileKey获取文件url
    const getFileUrl = async (type: 'frontPhoto' | 'reversePhoto') => {
      if (userInfo.value[type]) {
        const { data } = await getImageUrl({ fileKey: userInfo.value[type] });
        return data;
      }
    };

    watch(
      () => userInfo.value.frontPhoto,
      async () => {
        if (!frontPhoto.value) {
          const url = await getFileUrl('frontPhoto');
          frontPhoto.value = url;
        }
      },
      {
        immediate: true,
      },
    );

    watch(
      () => userInfo.value.reversePhoto,
      async () => {
        if (!reversePhoto.value) {
          const url = await getFileUrl('reversePhoto');
          reversePhoto.value = url;
        }
      },
      {
        immediate: true,
      },
    );

    // 表单校验规则
    const rules = {
      name: [
        { required: true, message: '请输入联系人中文姓名', trigger: 'blur' },
        { min: 2, max: 20, message: '联系人姓名长度在2到20个字符之间', trigger: 'blur' },
        { pattern: /^[\u4e00-\u9fa5]+$/g, message: '联系人姓名仅支持中文', trigger: 'blur' },
      ],
      phone: [
        { required: true, message: '请输入联系人电话', trigger: 'blur' },
        { pattern: /^\d{11}$/g, message: '联系人电话输入格式不合法，请重新输入', trigger: 'blur' },
      ],
      IDCard: [
        { required: true, message: '请输入联系人身份证号', trigger: 'blur' },
        {
          pattern: /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/g,
          message: '联系人身份证号输入格式不合法，请重新输入',
          trigger: 'blur',
        },
      ],
      email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
      ],
      frontPhoto: [{ required: true, message: '请上传身份证正面', trigger: 'blur' }],
      reversePhoto: [{ required: true, message: '请上传身份证反面', trigger: 'blur' }],
    };

    // 图片上传大小校验
    const beforeUpload = (file: { size: number; name: string }) => {
      if (iamgeTypes.indexOf(file.name.split('.')[1]) === -1) {
        (instance as any).proxy.$message({
          type: 'warning',
          message: '图片格式错误，仅支持bmp,jpg,png,jpeg格式图片',
        });
      }
      if (file.size > 1024 * 1024 * 3) {
        (instance as any).proxy.$message({
          type: 'warning',
          message: '上传图片大小不能超过 3Mb',
        });
        return false;
      }
    };

    // 身份证正面上传成功回调
    const frontUploadSuccess = (res: SuccessResponse<any>, file: { raw: unknown }) => {
      if (res.code === 0 && res.data?.fileKey) {
        userInfo.value.frontPhoto = res.data.fileKey;
        frontPhoto.value = URL.createObjectURL(file.raw);
      } else {
        (instance as any).proxy.$message({
          type: 'error',
          message: '上传失败，请重新上传！',
        });
      }
    };

    // 企业logo上传成功回调
    const reverseUploadSuccess = (res: SuccessResponse<any>, file: { raw: unknown }) => {
      if (res.code === 0 && res.data?.fileKey) {
        userInfo.value.reversePhoto = res.data.fileKey;
        reversePhoto.value = URL.createObjectURL(file.raw);
      } else {
        (instance as any).proxy.$message({
          type: 'error',
          message: '上传失败，请重新上传！',
        });
      }
    };

    return {
      IMAGE_UPLOAD,
      formRef,
      userInfo,
      frontPhoto,
      reversePhoto,
      rules,
      beforeUpload,
      frontUploadSuccess,
      reverseUploadSuccess,
    };
  },
};
</script>

<style scoped>
.userinfo-form {
  width: 100%;
}
</style>
