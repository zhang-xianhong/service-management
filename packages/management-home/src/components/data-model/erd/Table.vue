<template>
  <div
    class="erd-table-container"
    :style="{ left: `${table.position.x}px`, top: `${table.position.y}px` }"
    @mouseup="relationEnd(index)"
    @mouseenter="drawTempRleation(index)"
    @mouseleave="removeTempRleation()"
  >
    <div class="header">
      {{ table.name }}
    </div>
    <div class="body">
      <div v-for="(col, $index) in table.fields" :key="$index" class="column">
        <div>{{ col.name }}</div>
        <div>{{ types.find((type) => type.id === col.typeId)?.name }}</div>
      </div>
    </div>
    <div
      class="marker"
      v-for="marker in markers"
      :key="marker"
      :class="[marker]"
      @mousedown.stop="drawRelationStart($event, index)"
    ></div>
    <div class="operations">
      <i class="el-icon-circle-close" @click="removeModel(table.id)"></i>
      <i class="el-icon-link"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watchEffect, ref, inject } from 'vue';
import _ from 'lodash/fp';
import { drawRelationStart, drawRelationEnd, drawTempRleation, removeTempRleation } from './store';
import { deleteModel, createRelation } from '@/api/schema/model';
export default defineComponent({
  name: 'ErdTable',
  props: {
    index: {
      type: Number,
      required: true,
    },
    dragging: {
      type: Number,
      default: 0,
    },
    tableAttr: {
      type: Object,
      required: true,
    },
    types: {
      type: Array,
      required: true,
    },
  },
  setup(props, context) {
    const serviceId = inject('serviceId');
    const markers = ['top', 'right', 'bottom', 'left'];
    const removeModel = async (id: any) => {
      const { code } = await deleteModel({ ids: [id] });
      if (code === 0) {
        context.emit('model-change');
      }
    };
    const relationEnd = async (index: number) => {
      const checkRelation = drawRelationEnd(index);
      if (checkRelation) {
        const { code } = await createRelation({
          fromModelId: _.property('id')(checkRelation[0]),
          toModelId: _.property('id')(checkRelation[1]),
          serviceId,
          relationType: 1,
        });
        if (code === 0) context.emit('model-change');
      }
    };
    const table = ref({});
    watchEffect(() => {
      table.value = props.tableAttr;
    });
    return {
      markers,
      drawRelationStart,
      relationEnd,
      drawTempRleation,
      removeTempRleation,
      removeModel,
      table,
    };
  },
});
</script>

<style lang="scss" scoped>
.erd-table-container {
  position: absolute;
  width: 200px;
  border: 2px solid #a8daf2;
  border-radius: 9px;
  background: #daeffa;
  cursor: move;
  user-select: none;
  .header {
    padding: 0 10px;
    border-bottom: 2px solid #a8daf2;
    height: 36px;
    line-height: 36px;
    font-size: 12px;
    font-weight: 700;
    color: #333;
  }
  .body {
    width: 100%;
    font-size: 12px;
    color: #888;
    .column > div {
      padding: 2px 10px;
      width: 50%;
      float: left;
      line-height: 30px;
      height: 34px;
      &:deep(.el-input--small) {
        width: 100%;
        input {
          height: 28px;
        }
      }
    }
  }
  &:hover,
  &.selected {
    border: 2px solid #0595db;
    z-index: 1;
  }
  &:hover .marker {
    display: block;
    box-shadow: 0 0 4px 0px $warning;
    background: white;
    cursor: crosshair;
  }
  .marker {
    display: none;
    position: absolute;
    height: 10px;
    width: 10px;
    border: 1px solid black;
    border-radius: 5px;
    &.top {
      left: calc(50% - 5px);
      top: -5px;
    }
    &.bottom {
      left: calc(50% - 5px);
      bottom: -5px;
    }
    &.left {
      top: calc(50% - 5px);
      left: -5px;
    }
    &.right {
      top: calc(50% - 5px);
      right: -5px;
    }
  }
  &.selected .operations {
    display: block;
  }
  .operations {
    display: none;
    z-index: 2;
    width: 20px;
    position: absolute;
    left: 200px;
    top: 0;
    cursor: pointer;
    i {
      display: inline-block;
      background: white;
      width: 18px;
      height: 18px;
      font-size: 18px;
    }
  }
}
</style>
