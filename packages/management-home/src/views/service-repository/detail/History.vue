<template>
  <div class="service-history" v-loading="loading">
    <ul class="history-timeline">
      <li class="history-timeline__item" v-for="item in histories" :key="item.id">
        <div class="history-version">
          <span role="button" class="toggle" @click="item.collapsed = !item.collapsed">
            V{{ item.serviceVersion }}
            <i :class="!item.collapsed ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"></i>
          </span>
        </div>
        <div class="history-body">
          <el-collapse-transition>
            <div v-show="!item.collapsed">
              <div class="history-content" v-html="item.description"></div>
            </div>
          </el-collapse-transition>
        </div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { getRepositoryHistory } from '@/api/repository';
export default defineComponent({
  name: 'ServiceHistory',
  components: {},
  setup() {
    const loading = ref(true);
    const histories = ref([] as any[]);
    const fetchData = async () => {
      loading.value = true;
      const { data } = await getRepositoryHistory({});
      loading.value = false;
      histories.value = data.map((item: any, index: number) => {
        const newItem = { ...item };
        newItem.collapsed = index > 0;
        return newItem;
      });
    };
    fetchData();
    return {
      loading,
      histories,
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
    left: 180px;
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
    width: 140px;
    margin-right: 90px;
    text-align: right;

    .toggle {
      display: inline-flex;
      padding: 5px;
      align-items: center;
      i {
        font-size: 1rem;
        margin-left: 3px;
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
}
</style>
