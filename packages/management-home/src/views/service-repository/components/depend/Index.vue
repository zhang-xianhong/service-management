<template>
  <div class="service-depend-canvas" ref="container" v-loading="loading"></div>
</template>
<script>
import { defineComponent, ref, onBeforeUnmount, nextTick } from 'vue';
import { getServiceDepend } from '@/api/repository';
import DependGraph from './graph';
const formateTree = (data) => {
  const formate = (node, level) => {
    // eslint-disable-next-line no-param-reassign
    node.level = level;
    // eslint-disable-next-line no-param-reassign
    node.id = String(node.id);
    if (level === 2) {
      // eslint-disable-next-line no-param-reassign
      node.collapsed = true;
    }
    if (node?.children?.length) {
      node.children.forEach((item) => {
        formate(item, level + 1);
      });
    }
  };
  formate(data, 0);
  return data;
};
export default defineComponent({
  name: 'ServiceDepend',
  setup() {
    let dependGraph = null;
    const container = ref(null);
    const loading = ref(true);
    const dataLoaded = ref(false);

    const fetchData = async (service) => {
      const { data } = await getServiceDepend({
        serviceName: service?.serviceName || '',
        serviceVersion: service?.serviceVersion || '',
      });
      dataLoaded.value = true;
      return formateTree(data);
    };

    const render = async (service, force = false) => {
      if (!force && dataLoaded.value) {
        // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
        dependGraph && dependGraph.refresh();
        return;
      }
      if (force) {
        // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
        dependGraph && dependGraph.destroy();
      }
      loading.value = true;
      const data = await fetchData(service);
      nextTick(() => {
        dependGraph = DependGraph(container.value, data);
        loading.value = false;
      });
    };

    onBeforeUnmount(() => {
      // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
      dependGraph && dependGraph.destroy();
      dependGraph = null;
    });

    return {
      render,
      container,
      loading,
    };
  },
});
</script>
<style lang="scss" scoped>
.service-depend-canvas {
  width: 100%;
  height: 100%;
  user-select: none;
  overflow: hidden;
  ::v-deep svg {
    user-select: none;
    cursor: move;
  }
}
</style>
<style lang="scss">
.g6-component-toolbar {
  li {
    &[code='redo'],
    &[code='undo'] {
      display: none !important;
    }
  }
}
.g6-minimap {
  position: absolute;
  bottom: 20px;
  right: 20px;
  user-select: none;
  .g6-minimap-viewport {
    border: rgb(25, 128, 255) solid 2px;
    outline: none !important;
    cursor: move;
  }
}
</style>
