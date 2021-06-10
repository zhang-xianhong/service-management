<template>
  <div class="application-card">
    <div class="application-info">
      <el-upload
        class="application-info__image"
        :action="IMAGE_UPLOAD"
        accept=".jpg,.png,.jpeg"
        :show-file-list="false"
        :before-upload="beforeUpload"
        @success="logoUploadSuccess"
        @error="logoUploadError"
      >
        <img v-if="imageUrl" class="application-info__image" :src="imageUrl" alt="" />
        <div v-else class="application-info__content">
          <i class="el-icon-plus"></i>
          <div style="font-size: 12px;transform: scale(.8);transform-origin: center;">上传Logo</div>
        </div>
      </el-upload>
      <div class="application-detail">
        <div class="application-detail__name">{{ detailInfo.description }}</div>
        <div class="application-detail__englishname">{{ detailInfo.name }}</div>
        <div class="application-detail__desc">{{ detailInfo.remark }}</div>
      </div>
      <div class="application-operation">
        <!-- TODO:应用状态暂时屏蔽，后续开发 -->
        <!-- <div class="application-operation__status"></div> -->
        <svg-icon
          :icon-name="isDetailVisable ? 'list-hover' : 'list'"
          icon-class="application-operation__icon"
          @click="isDetailVisable = !isDetailVisable"
        ></svg-icon>
        <i class="el-icon-close application-operation__close" @click="onClose"></i>
      </div>
    </div>
  </div>
  <application-detail
    :visable="isDetailVisable"
    :detail="computedDetail"
    @close="onCloseDetail"
    v-if="getShowBool('delete')"
  ></application-detail>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, Ref, computed, SetupContext, getCurrentInstance, watch } from 'vue';
import { IMAGE_UPLOAD } from '@/shared/constant/file';
import ApplicationDetail from './ApplicationDetail.vue';
import { SuccessResponse } from '@/types/response';
import { updateAppById, deleteAppById } from '@/api/app';
import { getShowBool } from '@/utils/permission-show-module';
import { ElMessage, ElMessageBox } from 'element-plus';

interface PropsInterface {
  id: string;
  name: string;
  description: string;
  remark: string;
  thumbnail: string;
  services: number[];
}

export default defineComponent({
  name: 'ApplicationCard',
  components: { ApplicationDetail },
  props: {
    data: {
      type: Object as PropType<PropsInterface>,
      default: () => ({}),
    },
  },
  emits: ['update'],
  setup(props: { data: PropsInterface }, ctx: SetupContext) {
    const isDetailVisable: Ref<boolean> = ref(false);
    const detailInfo: Ref<PropsInterface> = ref(props.data);
    const imageUrl: Ref<string> = ref('');
    const instance = getCurrentInstance();

    if (props.data.thumbnail) {
      imageUrl.value = detailInfo.value.thumbnail;
    }

    watch(
      () => props.data,
      (value: PropsInterface) => {
        detailInfo.value = value;
      },
    );

    const computedDetail = computed(() => ({ ...detailInfo.value, imageUrl }));

    const onCloseDetail = () => {
      isDetailVisable.value = false;
      ctx.emit('update');
    };

    const onClose = async () => {
      ElMessageBox.confirm(`是否删除该应用？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { code } = await deleteAppById(detailInfo.value.id);
          ctx.emit('update');
          if (code === 0) {
            (instance as any).proxy.$message({
              type: 'success',
              message: '应用删除成功！',
            });
          } else {
            (instance as any).proxy.$message({
              type: 'error',
              message: '应用删除失败！',
            });
          }
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消操作',
          });
        });
    };

    const beforeUpload = (file: { size: number }) => {
      if (file.size > 1024 * 50) {
        (instance as any).proxy.$message({
          type: 'warning',
          message: '上传图片大小不能超过 50 kb',
        });
        return false;
      }
    };

    const logoUploadError = () => {
      (instance as any).proxy.$message({
        type: 'error',
        message: '上传失败，请重新上传！',
      });
    };

    const logoUploadSuccess = async (res: SuccessResponse<any>, file: { raw: unknown }) => {
      if (res.code === 0 && res.data?.fileKey) {
        detailInfo.value.thumbnail = res.data.fileKey;
        imageUrl.value = URL.createObjectURL(file.raw);
        updateAppById(detailInfo.value.id, detailInfo.value);
      } else {
        logoUploadError();
      }
    };

    return {
      IMAGE_UPLOAD,
      isDetailVisable,
      detailInfo,
      imageUrl,
      computedDetail,
      onCloseDetail,
      onClose,
      beforeUpload,
      logoUploadSuccess,
      logoUploadError,
      getShowBool,
    };
  },
});
</script>

<style lang="scss">
.application-info__image {
  background: #e3f0fc;
  .el-upload {
    width: 100%;
    height: 100%;
  }
}
</style>

<style scoped lang="scss">
.application-card {
  width: 300px;
  height: 90px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  margin: 10px;
  padding: 10px;
  display: inline-flex;
  &:hover {
    box-shadow: 0 0 8px #409eff;
    cursor: pointer;
  }
  .application-info {
    position: relative;
    &__image {
      display: inline-block;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;
      background: #e3f0fc;
    }
    &__content {
      display: inline-block;
      height: 100%;
      padding: 10px 0;
    }
    .application-detail {
      display: inline-block;
      margin-top: 20px;
      margin-left: 20px;
      width: 200px;
      &__name,
      &__englishname {
        font-size: 12px;
        font-weight: bolder;
        width: 80%;
        overflow: hidden;
        word-break: break-all;
        white-space: nowrap;
        text-overflow: ellipsis;
        // margin-bottom: 10px;
      }
      &__desc {
        font-size: 12px;
        width: 100%;
        height: 17px;
        overflow: hidden;
        word-break: break-all;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .application-operation {
      position: absolute;
      right: 0px;
      top: 0px;
      height: 22px;
      &__status {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 6px;
        margin-bottom: 2px;
        background: #bbb;
      }
      &__icon {
        margin-right: 6px;
      }
      &__close {
        font-size: 20px;
      }
    }
  }
}
</style>
