<template>
  <div class="application-card">
    <div class="application-info">
      <img :src="imageUrl" alt="" />
      <div class="application-detail">
        <div class="application-detail__name">{{ detailInfo.description }}</div>
        <div class="application-detail__desc">{{ detailInfo.remark }}</div>
      </div>
      <div class="application-operation">
        <div class="application-operation__status"></div>
        <svg-icon
          :icon-name="isDetailVisable ? 'list-hover' : 'list'"
          icon-class="application-operation__icon"
          @click="isDetailVisable = !isDetailVisable"
        ></svg-icon>
        <i class="el-icon-close application-operation__close"></i>
      </div>
    </div>
  </div>
  <application-detail
    :visable="isDetailVisable"
    :detail="computedDetail"
    @success="appUpdateHandler"
  ></application-detail>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, Ref, computed, SetupContext } from 'vue';
import { IMAGE_UPLOAD } from '@/shared/constant/file';
import { getImageUrl } from '@/api/files';
import ApplicationDetail from './ApplicationDetail.vue';

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

    const computedDetail = computed(() => ({ ...detailInfo.value, imageUrl }));

    const initializeImageUrl = async () => {
      const { data } = await getImageUrl({ fileKey: detailInfo.value.thumbnail });
      imageUrl.value = data;
    };

    initializeImageUrl();

    const appUpdateHandler = () => {
      isDetailVisable.value = false;
      ctx.emit('update');
    };

    return {
      IMAGE_UPLOAD,
      isDetailVisable,
      detailInfo,
      imageUrl,
      computedDetail,
      appUpdateHandler,
    };
  },
});
</script>

<style scoped lang="scss">
.application-card {
  width: 300px;
  height: 90px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  margin: 10px;
  padding: 10px;
  display: flex;
  &:hover {
    box-shadow: 0 0 8px #409eff;
    cursor: pointer;
  }
  .application-info {
    position: relative;
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;
    }
    .application-detail {
      display: inline-block;
      margin-left: 20px;
      width: 200px;
      &__name {
        font-size: 12px;
        font-weight: bolder;
        width: 80%;
        overflow: hidden;
        word-break: break-all;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-bottom: 10px;
      }
      &__desc {
        font-size: 12px;
        width: 100%;
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
