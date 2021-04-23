<template>
  <div>
    <div class="mask" v-if="maskText">{{ maskText }}</div>
    <div class="detail" :class="{ 'cannot-operate': !!maskText }">
      <el-row>
        <el-col :span="16">
          <el-button
            v-for="(button, index) in buttons"
            :key="index"
            :type="button.type || undefined"
            v-on="button.eventOption"
            :disabled="button.disabled"
            >{{ button.label }}</el-button
          >
        </el-col>
        <el-col :span="8" class="detail-operation">
          <div class="detail-status">
            <span :style="{ background: serverStatusInfo.color }" class="detail-status__icon"></span>
            <span :style="{ color: serverStatusInfo.color }">{{ serverStatusInfo.label }}</span>
          </div>
          <div class="detail-icons">
            <!-- 服务详情 -->
            <svg-icon icon-name="overview" icon-class="detail-icons__item" @click="openBaseInfo"></svg-icon>
            <!-- 接口列表 -->
            <svg-icon icon-name="list" icon-class="detail-icons__item" @click="openPropertyInfo"></svg-icon>
            <!-- 代码下载 -->
            <svg-icon icon-name="icon-download-manage" icon-class="detail-icons__item"></svg-icon>
            <!-- 文档下载 -->
            <svg-icon icon-name="daily" icon-class="detail-icons__item"></svg-icon>
            <!-- 服务配置 -->
            <svg-icon icon-name="setting" icon-class="detail-icons__item" @click="openConfigInfo"></svg-icon>
          </div>
        </el-col>
      </el-row>
      <el-row :style="{ height: computedHeight, background: '#fff', padding: '12px', marginBottom: '10px' }">
        <el-col :span="componentName ? 20 : 24" style="height:100%">
          <el-row>
            <!-- 服务下拉选择框 -->
            <el-select v-model="currentServiceId" placeholder="请选择" @change="selectService">
              <el-option
                v-for="server in serverList"
                :key="server.id"
                :value="server.id"
                :label="server.name"
              ></el-option>
            </el-select>
          </el-row>
          <div class="data-model__container">
            <erd
              v-loading="erdLoading"
              width="100%"
              height="100%"
              v-model="modelList"
              :serviceStatus="serverInfo.status"
              @model-change="initModelList"
              @select-change="modelSelected"
            ></erd>
          </div>
          <div v-if="!isShowDownDrawer">
            <div>服务代码：</div>
            <div>
              服务地址：
              <a :href="serverInfo.sshHost + (serverInfo.deposit ? serverInfo.deposit : '')" target="_blank">{{
                serverInfo.sshHost + (serverInfo.deposit ? serverInfo.deposit : '')
              }}</a>
            </div>
          </div>
        </el-col>
        <el-col v-if="componentName" :span="4" style="border-left: 1px solid #bbbbbb; height: 100%;">
          <template v-if="componentName">
            <keep-alive>
              <component
                :is="componentName"
                :data="computedComponentData"
                :tags="tags"
                :classifications="classifications"
                :id="currentServiceId"
              ></component>
            </keep-alive>
          </template>
        </el-col>
      </el-row>
      <transition name="slide-fade">
        <div v-if="isShowDownDrawer" class="detail-drawer__container">
          <keep-alive>
            <component
              :is="drawerName"
              :id="currentServiceId"
              :modelList="modelList.tables"
              @back="isShowDownDrawer = false"
            ></component>
          </keep-alive>
        </div>
      </transition>

      <el-dialog title="日志" v-model="logDialogVisible" width="80%" @close="clearLogInterVal">
        <!--      <el-input type="textarea" :rows="25" :autosize="{ maxRows: 25, minRows: 25 }" v-model="logData"></el-input>-->
        <div class="log-content" id="log_content">
          <div style="color: red" v-if="logData.length === 0">日志加载中......</div>
          <div class="log-item" v-for="item in logData" :key="item.instanceId">
            <div class="log-item-content" v-html="formatLogData(item.content)"></div>
          </div>
        </div>
        <div class="dialog-footer">
          <el-button type="primary" style="margin-top: 20px" @click="clearLogInterVal">关闭</el-button>
        </div>
      </el-dialog>
      <el-dialog title="变更记录" v-model="sqlDialogVisiable" width="60%" @close="clearSql">
        <div class="log-content sql-content" id="sql_content">
          <div style="color: blue" v-if="sqlData.length === 0">变更记录加载中......</div>
          <div class="log-item" v-for="(item, index) in Object.values(sqlData)" :key="index">
            <div class="log-item-content">{{ logs(item) }}</div>
          </div>
        </div>
        <div class="dialog-footer">
          <el-button type="primary" style="margin-top: 20px" @click="enterLogs">确定</el-button>
          <el-button style="margin-top: 20px" @click="clearSql">关闭</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import useButtonUtils from './utils/service-detail-utils';
import useStatusUtils from './utils/service-detail-status';
import ServerBaseInfo from './components/ServerBaseInfo.vue';
import Erd from '@/components/data-model/erd/Index.vue';
import ServerPortsInfo from './components/ServerPortsInfo.vue';
import { ref, Ref, reactive, watch, provide, computed, onBeforeUnmount, getCurrentInstance } from 'vue';
import RelationInfo from './components/RelationInfo.vue';
import ModelFieldForm from './components/FieldForm.vue';
import ModelBaseInfo from './components/ModelBaseInfo.vue';
import ServerConfigInfo from './components/ServerConfigInfo.vue';
import { getServiceList, getServiceById } from '@/api/servers';
import { getAllTags } from '@/api/settings/tags';
import { getClassificationList } from '@/api/settings/classification';
import { getServiceModelList, getModelDetail } from '@/api/schema/model';
import { getDataTypesAll } from '@/api/settings/data-types';
import { useRoute } from 'vue-router';
import {
  statusMap,
  computeStatusLabel,
  statusColor,
} from '@/views/service-management/business-service/utils/service-status-map';
import {
  currentServiceIdForData,
  sqlDialogVisiable,
  sqlData,
  clearSql,
  getTreaceId,
  thenRefresh,
} from './utils/service-detail-data';
import _ from 'lodash/fp';
import {
  logDialogVisible,
  logData,
  clearLogInterVal,
  formatLogData,
} from '@/views/service-management/business-service/utils/service-log-data-utils';

export default {
  name: 'ServiceDetail',
  components: {
    ServerBaseInfo,
    Erd,
    ModelFieldForm,
    ServerPortsInfo,
    RelationInfo,
    ModelBaseInfo,
    ServerConfigInfo,
  },
  setup() {
    const { buttons } = useButtonUtils();

    // 是否显示底部抽屉
    const isShowDownDrawer = ref(false);

    const computedHeight = computed(() => (isShowDownDrawer.value ? 'calc(95% - 400px)' : '95%'));

    // 获取路由信息
    const route = useRoute();

    // 当前服务ID
    const currentServiceId = ref(Number(route.params.id));
    currentServiceIdForData.value = route.params.id;

    // 属性列表是否已打开
    const isOpenProperties = ref(false);

    // 服务列表
    const serverList = reactive([] as any[]);

    const getServerList = async () => {
      const { data } = await getServiceList({});
      data.rows.forEach((x: any) => {
        // eslint-disable-next-line no-param-reassign
        x.name = x.name ? x.name.replace(/^srv-/g, '') : 'service name not found';
      });
      serverList.push(...(data.rows || []));
    };

    getServerList();

    // 服务详情信息
    const serverInfo = ref({} as any);

    // erd图组件参数构造
    provide('serviceId', currentServiceId.value);
    provide('serverInfo', serverInfo);
    const erdLoading = ref(false);
    const modelList: Ref<any> = ref({
      tables: [],
      relations: [],
    });
    // 获取模型列表
    const initModelList = async () => {
      // erdLoading.value = true;
      const { code, data } = await getServiceModelList({
        serviceId: currentServiceId.value,
      });
      // erdLoading.value = false;
      let tables: any[] = [];
      let relations: any[] = [];
      if (code === 0) {
        tables = data.models;
        relations = _.map((relation: any) => [
          _.findIndex({ id: relation.fromModelId })(tables),
          _.findIndex({ id: relation.toModelId })(tables),
          relation.relationType,
          relation.id,
        ])(data.relations);
      }
      let offset = 0;
      // 模型无定位时增加默认定位
      tables.forEach((table: any, index: number) => {
        const tablePosition = serverInfo.value?.config?.coordinate[table.id];
        const oldTablePosition = modelList.value.tables[index]?.position;
        if (oldTablePosition || tablePosition) {
          // eslint-disable-next-line no-param-reassign
          table.position = oldTablePosition || tablePosition;
        } else {
          // eslint-disable-next-line no-param-reassign
          table.position = {
            x: 200 + offset * 10,
            y: 20 + offset * 10,
          };
          offset += 1;
        }
      });
      modelList.value = {
        tables,
        relations,
      };
    };
    // 获取服务详情
    const getServerInfo = async () => {
      const { data } = await getServiceById({ id: currentServiceId.value });
      serverInfo.value = data;
      !modelList.value.tables.length && initModelList();
    };

    const intervalId = setInterval(() => getServerInfo(), 5000);

    getServerInfo();

    onBeforeUnmount(() => {
      clearInterval(intervalId);
    });

    const tags: any[] = [];

    // 获取所有标签
    const getTags = async () => {
      const { data } = await getAllTags();
      tags.push(...(data || []));
    };

    getTags();

    const classifications: any[] = [];

    // 获取所有分类信息
    const getClassifications = async () => {
      const { data } = await getClassificationList();
      classifications.push(...(data || []));
    };

    getClassifications();

    // 获取所有字段类型
    const allTypes = ref([]);
    const initTypeOption = async () => {
      const { code, data } = await getDataTypesAll();
      if (code === 0) {
        allTypes.value = data;
      }
    };
    initTypeOption();

    // 服务状态
    const serverStatusInfo = ref({});

    watch(serverInfo, () => {
      serverStatusInfo.value = useStatusUtils(serverInfo.value.status);
      const { status } = serverInfo.value;
      buttons.value.forEach((x: any) => {
        // eslint-disable-next-line no-param-reassign
        x.disabled = +status === 10 || +status === 20;
      });
      if (+status === 0) {
        buttons.value[1].disabled = true;
        buttons.value[2].disabled = true;
      }
      buttons.value[buttons.value.length - 1].disabled = false;
      buttons.value[0].label = +status === 0 || +status === 12 ? '初始化' : '同步配置';
      const statusmaps = computeStatusLabel(serverInfo.value.initTimes);
      serverStatusInfo.value = {
        label: (statusmaps as any)[status],
        color: (statusColor as any)[status],
      };
    });

    watch(thenRefresh, () => {
      getServerInfo();
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

    // 打开服务配置
    const openConfigInfo = () => {
      isShowDownDrawer.value = true;
      drawerName.value = 'ServerConfigInfo';
    };

    // 模型、关联详情数据
    const modelInfo = ref(null);
    provide('currentModel', modelInfo);
    provide('configs', { allTypes, tags, classifications });
    provide('afterRemove', () => {
      isShowDownDrawer.value = false;
      componentName.value = '';
      initModelList();
    });
    provide('afterUpdate', () => {
      initModelList();
    });

    const modelSelected = async (model: any) => {
      modelInfo.value = null;
      if (model) {
        if (model.relationInfo) {
          componentName.value = 'RelationInfo';
          modelInfo.value = model.relationInfo;
          isShowDownDrawer.value = false;
        } else {
          const { data } = await getModelDetail(model.id);
          componentName.value = 'ModelBaseInfo';
          modelInfo.value = { ...data, fields: model.fields };
          isShowDownDrawer.value = true;
          drawerName.value = 'ModelFieldForm';
        }
      } else {
        isShowDownDrawer.value = false;
        componentName.value = '';
      }
    };

    const computedComponentData = computed(() =>
      componentName.value === 'ServerBaseInfo' ? serverInfo.value : modelInfo.value,
    );

    const { proxy } = getCurrentInstance() as any;
    // 切换服务
    const selectService = (value: number) => {
      currentServiceId.value = value;
      let name = '';
      serverList.forEach((x: any) => {
        if (x.id === value) {
          name = x.name;
        }
      });
      componentName.value = '';
      isShowDownDrawer.value = false;
      proxy.$router.replace({
        path: `/service-management/service-list/detail/${value}`,
        query: { detailName: name },
      });
    };

    const logs = (res: any) => {
      console.log(res, 'this is log');
      return res;
    };

    const enterLogs = () => {
      getTreaceId().then((res) => {
        console.log(res, '2e323');
      });
    };

    const maskText = computed(() => {
      switch (serverInfo.value.status) {
        case 10:
          return '应用变更中, 请稍后...';
        case 20:
          return '应用启动中, 请稍后...';
        default:
          return '';
      }
    });

    return {
      isShowDownDrawer,
      computedHeight,
      currentServiceId,
      selectService,
      isOpenProperties,
      serverInfo,
      serverList,
      tags,
      classifications,
      buttons,
      serverStatusInfo,
      componentName,
      drawerName,
      openBaseInfo,
      openPropertyInfo,
      openConfigInfo,
      modelList,
      initModelList,
      erdLoading,
      modelSelected,
      modelInfo,
      logDialogVisible,
      logData,
      clearLogInterVal,
      formatLogData,
      computedComponentData,
      sqlDialogVisiable,
      sqlData,
      logs,
      clearSql,
      enterLogs,
      statusMap,
      maskText,
    };
  },
};
</script>

<style lang="scss" scoped>
.detail {
  height: calc(100vh - 170px);
  &-operation {
    text-align: right;
    height: 32px;
    line-height: 32px;
    vertical-align: middle;
  }
  &-icons {
    display: inline-flex;
    align-items: center;
    margin-left: 24px;
    &__item {
      width: 24px;
      height: 24px;
      background: #fff;
      padding: 4px;
      margin-right: 9px;
      &:hover {
        border: 1px solid #66bbff;
      }
    }
  }
  &-status {
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
  height: calc(100% - 120px);
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
}
.dialog-footer {
  width: 100%;
  display: block;
  text-align: center;
}
.log-content {
  width: 100%;
  height: 750px;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.8);
  font-size: 13px;
  color: #666666;
}
.sql-content {
  background-color: white;
  border: solid 1px rgba(0, 0, 0, 0.4);
  color: black;
  font-weight: 400;
  padding: 10px;
}
.log-item {
  width: 100%;
  margin-bottom: 20px;
}
.log-item-title {
  color: red;
}

.cannot-operate {
  pointer-events: none;
  filter: blur(5px);
}
.mask {
  width: 100%;
  height: 30px;
  margin-top: 30vh;
  text-align: center;
  position: absolute;
  z-index: 1;
  font-size: 22px;
}
</style>
