<template>
  <div class="detail">
    <el-row>
      <el-col :span="16">
        <el-button
          v-for="(button, index) in buttons"
          :key="index"
          :type="button.type || undefined"
          v-on="button.eventOption"
        >
          {{ button.label }}
        </el-button>
      </el-col>
      <el-col :span="8" style="text-align:right;">
        <div class="detail-status">
          <span :style="{ background: serverStatusInfo.color }" class="detail-status__icon"></span>
          {{ serverStatusInfo.label }}
        </div>
        <el-button class="detail-icon" icon="el-icon-s-data" @click="openBaseInfo"></el-button>
        <el-button class="detail-icon" icon="el-icon-notebook-2" @click="openPropertyInfo"></el-button>
        <el-button class="detail-icon" icon="el-icon-download" @click="openDownloadInfo"></el-button>
      </el-col>
    </el-row>
    <el-row :style="{ height: computedHeight }">
      <el-col :span="16" style="border-right: 1px solid #bbbbbb">
        <el-row>
          <!-- 服务下拉选择框 -->
          <el-select v-model="currentServiceId" placeholder="请选择">
            <el-option
              v-for="server in serverList"
              :key="server.id"
              :value="server.id"
              :label="server.name"
            ></el-option>
          </el-select>
        </el-row>
        <div class="data-model__container"></div>
        <div>
          <div>服务代码：</div>
          <div>服务地址：</div>
        </div>
      </el-col>
      <el-col :span="8">
        <template v-if="componentName">
          <keep-alive>
            <component :is="componentName" :data="serverInfo" :id="currentServiceId"></component>
          </keep-alive>
        </template>
      </el-col>
    </el-row>
    <transition name="slide-fade">
      <div v-if="isShowDownDrawer" class="detail-drawer__container">
        <keep-alive>
          <component :is="drawerName" :id="currentServiceId" @back="isShowDownDrawer = false"></component>
        </keep-alive>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import useButtonUtils from './utils/service-detail-utils';
import useStatusUtils from './utils/service-detail-status';
import ServerBaseInfo from './components/ServerBaseInfo.vue';
import ServerPortsInfo from './components/ServerPortsInfo.vue';
import { ref, reactive, watch, computed } from 'vue';
import { getServiceList, getServiceById } from '@/api/servers/index';
import { useRoute } from 'vue-router';

export default {
  name: 'ServiceDetail',
  components: {
    ServerBaseInfo,
    ServerPortsInfo,
  },
  setup() {
    const { buttons } = useButtonUtils();

    // 是否显示底部抽屉
    const isShowDownDrawer = ref(false);

    const computedHeight = computed(() => (isShowDownDrawer.value ? 'calc(95% - 400px)' : '95%'));

    // 获取路由信息
    const route = useRoute();

    // 当前服务ID
    const currentServiceId = ref(route.params.id);

    // 属性列表是否已打开
    const isOpenProperties = ref(false);

    // 服务列表
    const serverList = reactive([] as any[]);

    const getServerList = async () => {
      const { data } = await getServiceList({});
      serverList.push(...(data.rows || []));
    };

    getServerList();

    // 服务详情信息
    const serverInfo = ref({} as any);

    // 获取服务详情
    const getServerInfo = async () => {
      const { data } = await getServiceById({ id: currentServiceId.value });
      serverInfo.value = data;
    };

    getServerInfo();

    // 服务状态
    const serverStatusInfo = ref({});

    watch(serverInfo, () => {
      serverStatusInfo.value = useStatusUtils(serverInfo.value.status);
    });

    // 右侧组件名称
    const componentName = ref('');

    // 打开基本信息
    const openBaseInfo = () => {
      componentName.value = 'ServerBaseInfo';
    };

    // 下侧组件名称
    const drawerName = ref('');

    // 打开接口配置
    const openPropertyInfo = () => {
      isShowDownDrawer.value = true;
      drawerName.value = 'ServerPortsInfo';
    };

    // 打开下载详情
    const openDownloadInfo = () => {
      componentName.value = 'ServerPropertyInfo';
    };

    return {
      isShowDownDrawer,
      computedHeight,
      currentServiceId,
      isOpenProperties,
      serverInfo,
      serverList,
      buttons,
      serverStatusInfo,
      componentName,
      drawerName,
      openBaseInfo,
      openPropertyInfo,
      openDownloadInfo,
    };
  },
};
</script>

<style lang="scss" scoped>
.detail {
  height: 90vh;
  &-icon {
    padding: 9px;
  }
  &-status {
    margin-right: 8px;
    display: inline-block;
    &__icon {
      display: inline-block;
      width: 14px;
      height: 14px;
      border-radius: 7px;
      margin-right: 4px;
    }
  }
}
.data-model__container {
  width: 100%;
  height: 90%;
}
.slide-fade-enter-active {
  transition: all 0.3s ease-in;
}

.slide-fade-leave-active {
  transition: all 0.8s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(440px);
  height: 0;
}
.detail-drawer__container {
  height: 400px;
  overflow: auto;
  padding: 12px;
}
</style>
