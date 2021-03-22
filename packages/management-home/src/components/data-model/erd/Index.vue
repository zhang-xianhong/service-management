<template>
  <div
    class="erd-container-wrapper"
    :style="{ width, height }"
    @mouseup="dragStop"
    @mouseleave="dragStop"
    @mousemove="drag"
  >
    <div :style="`width: ${viewWidth}px; height: ${viewHeight}px; position: relative;`">
      <add-model></add-model>
      <erd-relation></erd-relation>
      <erd-table
        v-for="(table, $index) in tables"
        :key="$index"
        :index="$index"
        :dragging="table.dragging"
        :class="{ selected: table.selected }"
        @mousedown="selectedTable(table)"
      ></erd-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watchEffect } from 'vue';
import _ from 'lodash/fp';
import {
  tables,
  relations,
  relationLines,
  getLines,
  move,
  clearSelected,
  drawingRelation,
  draw,
  clearNewRelation,
  viewWidth,
  viewHeight,
  recalcCanvasSize,
} from './store';
import ErdTable from './Table.vue';
import ErdRelation from './Relation.vue';
import AddModel from './AddModel.vue';
export default defineComponent({
  name: 'Erd',
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    width: {
      type: [Number, String],
      required: true,
    },
    height: {
      type: [Number, String],
      required: true,
    },
  },
  components: { ErdTable, ErdRelation, AddModel },
  setup(props, context) {
    watchEffect(() => {
      tables.value = props.modelValue.tables.value || [];
      relations.value = props.modelValue.relations.value || [];
      relationLines.value = getLines();
      recalcCanvasSize();
    });
    const dragStop = () => {
      tables.value.forEach((table) => {
        // eslint-disable-next-line no-param-reassign
        table.dragging = false;
      });
      clearNewRelation();
    };
    const drag = (ev: MouseEvent) => {
      const dragTableIndex = _.findIndex(_.property('dragging'))(tables.value);
      ~dragTableIndex &&
        move(dragTableIndex, ev.movementX / window.devicePixelRatio, ev.movementY / window.devicePixelRatio);
      drawingRelation.value && draw(ev);
    };
    const selectedTable = (table: any) => {
      clearSelected();
      // eslint-disable-next-line no-param-reassign
      table.selected = true;
      // eslint-disable-next-line no-param-reassign
      table.dragging = true;
      context.emit('selectChange', table);
    };
    return {
      tables,
      dragStop,
      drag,
      selectedTable,
      viewWidth,
      viewHeight,
    };
  },
});
</script>

<style lang="scss" scoped>
.erd-container-wrapper {
  position: relative;
  overflow: auto;
}
</style>
