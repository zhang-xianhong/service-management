<template>
  <div
    class="erd-container-wrapper"
    :style="{ width, height }"
    @mouseup="dragStop"
    @mouseleave="dragStop"
    @mousemove="drag"
    @mousedown.capture="clearSelect"
  >
    <div :style="`width: ${viewWidth}px; height: ${viewHeight}px; position: relative;`">
      <add-model @model-change="modelChange"></add-model>
      <erd-relation @model-change="modelChange"></erd-relation>
      <template v-if="allTypes.length">
        <erd-table
          v-for="(table, $index) in tables"
          :key="$index"
          :index="$index"
          :dragging="table.dragging"
          :class="{ selected: table.selected }"
          :tableAttr="table"
          :types="allTypes"
          @mousedown="selectedTable(table)"
          @model-change="modelChange"
        ></erd-table>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watchEffect, ref, inject } from 'vue';
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
  svgOffset,
} from './store';
import ErdTable from './Table.vue';
import ErdRelation from './Relation.vue';
import AddModel from './AddModel.vue';
import { getDataTypesAll } from '@/api/settings/data-types';
import { updateConfig } from '@/api/schema/model';
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
    const serviceId = inject('serviceId');
    watchEffect(() => {
      tables.value = props.modelValue.tables || [];
      relations.value = props.modelValue.relations || [];
      relationLines.value = getLines();
      recalcCanvasSize();
    });
    const dragStop = async () => {
      const draggingTable: any = _.find('dragging')(tables.value);
      if (draggingTable && Date.now() - draggingTable.dragging > 100) {
        const coordinate: Record<string, any> = {};
        tables.value.forEach((table: any) => {
          // eslint-disable-next-line no-param-reassign
          table.dragging = 0;
          coordinate[table.id] = table.position;
        });
        const { code } = await updateConfig({
          serviceId,
          config: {
            coordinate,
          },
        });
        if (code === 0) {
          context.emit('model-change');
        }
      }
      tables.value.forEach((table: any) => {
        // eslint-disable-next-line no-param-reassign
        table.dragging = 0;
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
      table.dragging = Date.now();
      context.emit('selectChange', table);
    };
    const clearSelect = () => {
      clearSelected();
      context.emit('selectChange', null);
    };
    const calcSvgPosition = () => {
      const svgElem = document.querySelector('.erd-container-wrapper svg') as HTMLElement;
      const x = svgElem.getBoundingClientRect().left + document.documentElement.scrollLeft;
      const y = svgElem.getBoundingClientRect().top + document.documentElement.scrollTop;
      svgOffset.value = { x, y };
    };
    const modelChange = () => {
      context.emit('model-change');
    };
    const allTypes = ref([]);
    const initTypeOption = async () => {
      const { code, data } = await getDataTypesAll({});
      if (code === 0) {
        allTypes.value = data;
      }
    };
    onMounted(() => {
      calcSvgPosition();
      const svgElem = document.querySelector('.erd-container-wrapper svg') as HTMLElement;
      const closestScroll = svgElem.closest('.el-scrollbar__wrap');
      if (closestScroll) {
        closestScroll.addEventListener('scroll', calcSvgPosition);
      }
      initTypeOption();
    });
    return {
      tables,
      dragStop,
      drag,
      selectedTable,
      viewWidth,
      viewHeight,
      clearSelected,
      clearSelect,
      modelChange,
      allTypes,
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
