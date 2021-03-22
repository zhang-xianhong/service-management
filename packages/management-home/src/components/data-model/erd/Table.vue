<template>
  <div
    class="erd-table-container"
    :style="{ left: `${position.x}px`, top: `${position.y}px` }"
    @mouseup="drawRelationEnd(index)"
    @mouseenter="drawTempRleation(index)"
    @mouseleave="removeTempRleation()"
  >
    <div class="header">
      {{ name }}
    </div>
    <div class="body">
      <div v-for="(col, $index) in columns" :key="$index" class="column">
        <div>{{ col.name }}</div>
        <div>{{ col.type }}</div>
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
      <i class="el-icon-circle-close"></i>
      <i class="el-icon-link"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { tables, drawRelationStart, drawRelationEnd, drawTempRleation, removeTempRleation } from './store';
export default defineComponent({
  name: 'ErdTable',
  props: {
    index: {
      type: Number,
      required: true,
    },
    dragging: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const table = tables.value[props.index];
    const markers = ['top', 'right', 'bottom', 'left'];
    return {
      markers,
      drawRelationStart,
      drawRelationEnd,
      drawTempRleation,
      removeTempRleation,
      ...table,
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
