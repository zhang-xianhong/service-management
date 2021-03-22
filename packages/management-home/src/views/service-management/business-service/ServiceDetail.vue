<template>
  <div class="detail">
    <el-row>
      <el-col :span="20">
        <el-button
          v-for="(button, index) in buttons"
          :key="index"
          :type="button.type || undefined"
          v-on="button.eventOption"
        >
          {{ button.label }}
        </el-button>
      </el-col>
      <el-col :span="4" style="text-align:right;">
        <el-button class="detail-icon" icon="el-icon-s-data" @click="openBaseInfo"></el-button>
        <el-button class="detail-icon" icon="el-icon-notebook-2" @click="openPropertyInfo"></el-button>
        <el-button class="detail-icon" icon="el-icon-download" @click="openDownloadInfo"></el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="16" style="border-right: 1px solid #bbbbbb">
        <el-row>
          <!-- 服务下拉选择框 -->
          <el-col :span="20">
            <el-select v-model="currentServiceId" placeholder="请选择">
              <el-option
                v-for="server in serverList"
                :key="server.id"
                :value="server.id"
                :label="server.name"
              ></el-option>
            </el-select>
          </el-col>
          <!-- 服务状态 -->
          <el-col :span="4">
            <span :style="{ background: serverStatusInfo.color }" class="detail-status__icon"></span>
            {{ serverStatusInfo.label }}
          </el-col>
        </el-row>
        <div class="data-model__container"></div>
        <div>
          <div>服务代码：</div>
          <div>服务地址：</div>
        </div>
      </el-col>
      <el-col :span="8">
        <template v-if="isInitialized && componentName">
          <keep-alive>
            <component :is="componentName" :data="serverInfo" :id="currentServiceId"></component>
          </keep-alive>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import useButtonUtils from './utils/service-detail-utils';
import useStatusUtils from './utils/service-detail-status';
import ServerBaseInfo from './components/ServerBaseInfo.vue';
import { ref, reactive, watch } from 'vue';
import { getServiceList, getServiceById } from '@/api/servers/index';
import { useRoute } from 'vue-router';

export default {
  name: 'ServiceDetail',
  components: {
    ServerBaseInfo,
  },
  setup() {
    const { buttons } = useButtonUtils();

    // 获取路由信息
    const route = useRoute();

    // 是否尚未初始化，默认值为false
    const isInitialized = ref(true);

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

    const getServerInfo = async () => {
      const { data } = await getServiceById({ id: currentServiceId });
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
      isInitialized.value = true;
      componentName.value = 'ServerBaseInfo';
    };

    // 打开接口配置
    const openPropertyInfo = () => {
      isInitialized.value = true;
      componentName.value = 'ServerPropertyInfo';
    };

    // 打开下载详情
    const openDownloadInfo = () => {
      isInitialized.value = true;
      componentName.value = 'ServerPropertyInfo';
    };

    return {
      currentServiceId,
      isInitialized,
      isOpenProperties,
      serverInfo,
      serverList,
      buttons,
      serverStatusInfo,
      componentName,
      openBaseInfo,
      openPropertyInfo,
      openDownloadInfo,
    };
  },
};
</script>

<style lang="scss" scoped>
.detail {
  height: 100%;
  &-icon {
    padding: 9px;
  }
  &-status__icon {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 7px;
  }
}
.data-model__container {
  width: 100%;
  min-height: 600px;
}
</style>
