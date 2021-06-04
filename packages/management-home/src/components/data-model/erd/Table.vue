<template>
  <div
    class="erd-table-container"
    :table-index="index"
    :style="{ left: `${table.position.x}px`, top: `${table.position.y}px` }"
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
      <i class="el-icon-circle-close" @click.stop="removeModel(table)"></i>
      <i class="el-icon-link"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, inject } from 'vue';
import { drawRelationStart, drawTempRleation, removeTempRleation } from './store';
import { deleteModel } from '@/api/schema/model';
import { ElMessageBox } from 'element-plus';
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
  setup(props) {
    const erdEmit = inject('erdEmit') as Function;
    const markers = ['top', 'right', 'bottom', 'left'];
    const removeModel = async (table: any) => {
      ElMessageBox.confirm(`确认删除对象${table.name}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const { code } = await deleteModel({ ids: [table.id] });
        if (code === 0) {
          erdEmit('model-change');
        }
      });
    };
    const table = computed(() => props.tableAttr);
    return {
      markers,
      drawRelationStart,
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
  border: 2px solid #ddd;
  background: white;
  cursor: move;
  user-select: none;
  .header {
    padding: 0 10px;
    border-bottom: 2px solid #ddd;
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
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
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
  &:hover .operations {
    display: block;
  }
  .operations {
    display: none;
    z-index: -2;
    width: 30px;
    height: 100px;
    text-align: right;
    margin-left: -10px;
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
