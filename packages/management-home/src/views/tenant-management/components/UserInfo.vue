<template>
  <el-row>企业联系人信息</el-row>
  <el-row style="padding:0px 20px;">
    <el-form ref="formRef" class="tenant-form" :model="userInfo" inline label-width="140px" label-position="left">
      <el-form-item prop="name" class="form-item" label="联系人姓名" required>
        {{ userInfo.name }}
      </el-form-item>
      <el-form-item prop="phone" class="form-item" label="联系人电话" required>
        {{ userInfo.phone }}
      </el-form-item>
      <el-form-item prop="IDCard" class="form-item" label="联系人身份证号" required>
        {{ userInfo.IDCard }}
      </el-form-item>
      <el-form-item prop="email" class="form-item" label="联系人邮箱" required>
        {{ userInfo.email }}
      </el-form-item>
      <el-form-item prop="frontPhoto" class="form-item" label="身份证正面" required>
        <img v-if="frontPhoto" :src="frontPhoto" class="avatar" />
      </el-form-item>
      <el-form-item prop="reversePhoto" class="form-item" label="身份证反面" required>
        <img v-if="reversePhoto" :src="reversePhoto" class="avatar" />
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script lang="ts">
import { computed, WritableComputedRef, watch, Ref, ref } from 'vue';
import { IMAGE_UPLOAD } from '@/shared/constant/file';
import { getImageUrl } from '@/api/files';

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
      default: () => ({
        contact: {},
      }),
    },
  },
  setup(props: { isEdit: boolean; modelValue: any }) {
    // 联系人信息
    const userInfo: WritableComputedRef<UserInfoInterface> = computed(() => props.modelValue.contact);

    const frontPhoto: Ref<string> = ref('');

    const reversePhoto: Ref<string> = ref('');

    // 根据fileKey获取文件url
    const getFileUrl = async (type: 'frontPhoto' | 'reversePhoto') => {
      if (userInfo.value[type]) {
        const { data } = await getImageUrl({ fileKey: userInfo.value[type] });
        return data;
      }
    };

    watch(
      () => userInfo.value,
      async () => {
        if (!frontPhoto.value) {
          const url = await getFileUrl('frontPhoto');
          frontPhoto.value = url;
        }
      },
    );

    watch(
      () => userInfo.value,
      async () => {
        if (!reversePhoto.value) {
          const url = await getFileUrl('reversePhoto');
          reversePhoto.value = url;
        }
      },
    );

    return {
      IMAGE_UPLOAD,
      userInfo,
      frontPhoto,
      reversePhoto,
    };
  },
};
</script>

<style scoped>
.userinfo-form {
  width: 100%;
}
</style>
