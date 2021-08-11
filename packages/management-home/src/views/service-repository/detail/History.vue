<template>
  <div class="service-history" v-loading="loading">
    <ul class="history-timeline">
      <li class="history-timeline__item" v-for="item in histories" :key="item.id">
        <div class="history-version" :style="{ color: statusColor[item.status] }">
          <span role="button" class="toggle" @click="item.collapsed = !item.collapsed" style="display: block">
            {{ item.serviceVersion }}
            <i :class="!item.collapsed ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"></i>
          </span>
          <el-collapse-transtion>
            <div v-show="!item.collapsed">
              {{ dateFormat(item.createTime) }}
            </div>
            <div v-show="!item.collapsed">
              {{ statusMap[item.status] }}
            </div>
          </el-collapse-transtion>
        </div>
        <div class="history-body">
          <el-collapse-transition>
            <div v-show="!item.collapsed">
              <div class="history-content" v-html="parseDescriptionHtml(item.description)"></div>
              <el-button type="text" @click="handleShowVersionInfo(item)">更多</el-button>
            </div>
          </el-collapse-transition>
        </div>
      </li>
    </ul>
    <version-info-dialog ref="versionInfoDialogRef" />
    <div class="sa-list-wrap__empty" v-if="!loading && histories.length === 0">暂无数据</div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { getRepositoryHistory } from '@/api/repository';
import VersionInfoDialog from './Version-Info-Dialog.vue';
import { parseDescriptionHtml } from '../util';
import { useRoute } from 'vue-router';
import dateFormat from '@/utils/date-format';
export default defineComponent({
  name: 'ServiceHistory',
  components: {
    VersionInfoDialog,
  },
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
    isService: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const loading = ref(true);
    const histories = ref([] as any[]);
    const versionInfoDialogRef = ref(null as any);
    const router = useRoute();
    const { params } = router;

    const statusMap = {
      10: '发版成功',
      2: '发版失败',
      1: '发版中',
    };

    const statusColor = {
      10: '#0ABF5B',
      2: '#E54545',
      1: '#FF9D00',
    };

    const fetchData = async () => {
      loading.value = true;
      try {
        const query: any = {};
        if (props.isService) {
          query.serviceId = params.id;
        } else {
          query.repositoryId = params.id;
        }
        const { data } = await getRepositoryHistory(query);
        histories.value = data.map((item: any, index: number) => {
          const newItem = { ...item };
          newItem.collapsed = index > 0;
          return newItem;
        });
      } catch (e) {
        console.log(e);
      } finally {
        loading.value = false;
      }
    };

    const handleShowVersionInfo = (row: any) => {
      versionInfoDialogRef.value.handleOpen(row.snapshotNo);
    };
    fetchData();
    return {
      loading,
      histories,
      versionInfoDialogRef,
      handleShowVersionInfo,
      parseDescriptionHtml,
      statusMap,
      statusColor,
      params,
      dateFormat,
    };
  },
});
</script>
<style lang="scss" scoped>
.service-history {
  padding: 20px;
  min-height: 200px;
}
.history-timeline {
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;

  &::before {
    content: '';
    position: absolute;
    width: 1px;
    left: 200px;
    height: 100%;
    top: 0;
    bottom: 0;
    background-color: #e4e7ed;
  }
  &__item {
    display: flex;
    flex-flow: row nowrap;
    max-width: 640px;
    margin-bottom: 20px;
  }

  .history-version {
    flex-shrink: 0;
    width: 200px;
    margin-right: 120px;
    text-align: center;

    .toggle {
      display: inline-flex;
      padding: 5px;
      align-items: center;
      i {
        font-size: 0.5rem;
        margin-left: 2px;
        color: #999;
      }
    }
  }

  .history-body {
    flex: 1;
  }

  .history-content {
    line-height: 20px;
    max-height: 300px;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 15;
    -webkit-box-orient: vertical;
  }
  //.history-left {
  //  text-align: center;
  //}
}
</style>
