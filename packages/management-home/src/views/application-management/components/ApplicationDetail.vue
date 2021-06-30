<template>
  <el-dialog
    :title="isEditable ? '编辑应用' : '应用基本信息'"
    v-model="isVisable"
    width="500px"
    destroy-on-close
    v-on:open="onOpen"
  >
    <el-form :model="detailInfo" label-width="120px" label-position="left">
      <el-form-item
        label="应用中文名称"
        prop="description"
        :rules="[
          { required: true, message: '内容不能为空', trigger: 'blur' },
          { min: 3, max: 20, message: '应用中文名称长度在3到20个字符之间' },
        ]"
      >
        <el-input v-if="isEditable" v-model="detailInfo.description" placeholder="请输入中文名称"></el-input>
        <template v-else>{{ detailInfo.description }}</template>
      </el-form-item>
      <el-form-item label="应用英文名称" prop="name" required>{{ detailInfo.name }}</el-form-item>
      <el-form-item>
        <template v-slot:label>
          应用图标
          <i class="el-icon-question info-icon"></i>
        </template>
        <el-upload
          v-if="isEditable"
          class="avatar-uploader"
          :action="IMAGE_UPLOAD"
          accept=".jpg, .png, .jpeg"
          :show-file-list="false"
          :before-upload="beforeUpload"
          @success="logoUploadSuccess"
          @error="logoUploadError"
        >
          <i v-if="!detailInfo.imageUrl" class="el-icon-plus avatar-uploader-icon"></i>
          <img v-else style="width: 110px; height: 110px" :src="detailInfo.imageUrl" alt />
        </el-upload>
        <img v-else v-show="detailInfo.imageUrl" style="width: 110px; height: 110px" :src="detailInfo.imageUrl" alt />
      </el-form-item>
      <el-form-item label="应用简介">
        <el-input
          v-if="isEditable"
          v-model="detailInfo.remark"
          type="textarea"
          :rows="3"
          placeholder="请输入应用简介，小于225字"
          maxlength="225"
          show-word-limit
        ></el-input>
        <template v-else>{{ detailInfo.remark }}</template>
      </el-form-item>
      <el-form-item label="关联服务">
        <el-select v-if="isEditable" v-model="serviceIds" multiple>
          <el-option v-for="(item, index) in allService" :key="index" :value="item.id" :label="item.name"></el-option>
        </el-select>
        <template v-else>{{ computedServicesName }}</template>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <template v-if="getShowBool('update')">
        <el-button v-if="isEditable" type="primary" @click="updateAppDetail" :loading="submitting">确定</el-button>
        <el-button v-else type="primary" @click="isEditable = true">编辑</el-button>
      </template>
      <el-button @click="handleCloseDialog('cancel')">{{ isEditable ? '取消' : '关闭' }}</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, PropType, Ref, ref, computed, SetupContext } from 'vue';
import { IMAGE_UPLOAD } from '@/shared/constant/file';
import { SuccessResponse } from '@/types/response';
import { updateAppById } from '@/api/app';
import { getAllService, allService } from '@/views/service-management/business-service/utils/service-data-utils';
import { getShowBool } from '@/utils/permission-show-module';

interface DetailInterface {
  id: string;
  name: string;
  description: string;
  remark: string;
  thumbnail: string;
  services: any[];
  imageUrl: string;
}

export default defineComponent({
  name: 'ApplicationDetail',
  inheritAttrs: false,
  props: {
    visable: {
      type: Boolean,
      default: false,
    },
    detail: {
      type: Object as PropType<DetailInterface>,
      default: () => ({}),
    },
  },
  emits: ['close'],
  setup(props: { visable: boolean; detail: DetailInterface }, ctx: SetupContext) {
    const instance = getCurrentInstance();
    const detailInfo: Ref<DetailInterface> = ref(props.detail);
    const isEditable: Ref<boolean> = ref(false);
    const submitting = ref(false);

    const isVisable: any = computed(() => props.visable);
    // 每次打开会保留上一次的数据，需要重置
    const onOpen = () => {
      detailInfo.value = props.detail;
      isEditable.value = false;
    };
    getAllService();

    const serviceIds = ref(props.detail.services.map((item: any) => item.serviceId));

    const computedServicesName = computed(() => {
      const services = allService.value.filter((item: any) => serviceIds.value.includes(item.id));
      return services.map((service: any) => service.name).join(',');
    });

    const logoUploadError = () => {
      (instance as any).proxy.$message({
        type: 'error',
        message: '上传失败，请重新上传！',
      });
    };

    const logoUploadSuccess = (res: SuccessResponse<any>, file: { raw: unknown }) => {
      if (res.code === 0 && res.data?.fileKey) {
        detailInfo.value.thumbnail = res.data.fileKey;
        detailInfo.value.imageUrl = URL.createObjectURL(file.raw);
      } else {
        logoUploadError();
      }
    };

    const beforeUpload = (file: { size: number }) => {
      if (file.size > 1024 ** 2 * 3) {
        (instance as any).proxy.$message({
          type: 'warning',
          message: '上传图片大小不能超过3M',
        });
        return false;
      }
    };

    const updateAppDetail = async () => {
      const descriptionLength = detailInfo.value.description.length;
      if (descriptionLength < 3 || descriptionLength > 20) {
        return false;
      }
      submitting.value = true;
      const { code } = await updateAppById(detailInfo.value.id, {
        ...detailInfo.value,
        ...{ services: serviceIds.value },
      });
      if (code === 0) {
        (instance as any).proxy.$message({
          type: 'success',
          message: '应用更新成功',
        });
        isEditable.value = false;
        ctx.emit('close');
      }
      submitting.value = false;
    };

    const handleCloseDialog = (type: string) => {
      isEditable.value = false;
      ctx.emit('close', type);
    };

    return {
      IMAGE_UPLOAD,
      allService,
      serviceIds,
      computedServicesName,
      isVisable,
      isEditable,
      detailInfo,
      logoUploadError,
      logoUploadSuccess,
      beforeUpload,
      updateAppDetail,
      handleCloseDialog,
      getShowBool,
      onOpen,
      submitting,
    };
  },
});
</script>

<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  &:hover {
    border-color: #409eff;
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 115px;
  height: 85px;
  line-height: 85px;
  text-align: center;
}
</style>

<style lang="scss" scoped>
.info-icon {
  cursor: pointer;
  &:hover {
    &::after {
      content: '建议尺寸110x110，支持png、jpg格式，小于3M';
      position: absolute;
      margin-top: -30px;
      margin-left: -40px;
      z-index: 11;
      padding: 5px;
      background-color: white;
      box-shadow: 0 0 6px rgb(0 0 0 / 20%);
    }
  }
}
.dialog-footer {
  display: flex;
  justify-content: center;
}
</style>
