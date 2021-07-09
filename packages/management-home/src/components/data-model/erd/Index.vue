<template>
  <div class="erd-container-wrapper" :style="{ width, height }" v-on="handlers">
    <div :style="`width: ${viewWidth}px; height: ${viewHeight}px; position: relative;`">
      <add-model v-if="getShowBool('add')"></add-model>
      <erd-relation></erd-relation>
      <template v-if="allTypes.length">
        <erd-table
          v-for="(table, $index) in tables"
          :key="$index"
          :index="$index"
          :dragging="logs(table.dragging)"
          :class="{ selected: table.selected }"
          :tableAttr="table"
          :types="allTypes"
        ></erd-table>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watchEffect, inject, provide, onBeforeUnmount } from 'vue';
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
  drawRelationEnd,
} from './store';
import ErdTable from './Table.vue';
import ErdRelation from './Relation.vue';
import AddModel from './AddModel.vue';
import { updateConfig, createRelation, updateRelation } from '@/api/schema/model';
import { getShowBool } from '@/utils/permission-show-module';
import { isRefrence } from '@/views/service-management/business-service/utils/permisson';
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
    serviceStatus: {
      type: Number,
      default: 0,
    },
  },
  components: { ErdTable, ErdRelation, AddModel },
  setup(props, context) {
    const serviceId = inject('serviceId');
    const { allTypes } = inject('configs') as any;
    const erdEmit = context.emit;
    provide('erdEmit', erdEmit);
    // inject isRefrenceService
    const isRefrenceService = inject(isRefrence);
    watchEffect(() => {
      tables.value = props.modelValue.tables || [];
      relations.value = props.modelValue.relations || [];
      relationLines.value = getLines();
      recalcCanvasSize();
    });
    const drag = (ev: MouseEvent) => {
      const dpr = navigator.platform === 'Win32' ? window.devicePixelRatio : 1;
      const dragTableIndex = _.findIndex(_.property('dragging'))(tables.value);
      ~dragTableIndex && move(dragTableIndex, ev.movementX / dpr, ev.movementY / dpr);
      drawingRelation.value && draw(ev);
    };
    const tableMousedown = (table: any) => {
      clearSelected();
      // eslint-disable-next-line no-param-reassign
      table.selected = true;
      // eslint-disable-next-line no-param-reassign
      table.dragging = Date.now();
    };
    const calcSvgPosition = () => {
      const svgElem = document.querySelector('.erd-container-wrapper svg') as HTMLElement;
      const x = svgElem.getBoundingClientRect().left + document.documentElement.scrollLeft;
      const y = svgElem.getBoundingClientRect().top + document.documentElement.scrollTop;
      svgOffset.value = { x, y };
    };
    const modelChange = () => {
      erdEmit('model-change', null);
    };

    // 判断当前事件类型
    const getEventType = () => {
      const hoverTable = document.querySelector('.erd-table-container:hover');
      if (hoverTable) {
        if (drawingRelation.value) return 'DrawingRelation';
        const currentTable = tables.value[Number(hoverTable.getAttribute('table-index'))];
        const isDrag = currentTable.dragging && Date.now() - currentTable.dragging > 200;
        if (!isDrag) return 'ClickTable';
        return 'DragTable';
      }
      const hoverRevert = document.querySelector('.relation-revert:hover');
      if (hoverRevert) {
        return 'RelationRevert';
      }
      const hoverLine = document.querySelector('.relation-line:hover');
      if (hoverLine) {
        return 'RelationClick';
      }
      return 'Blank';
    };

    // 拖拽结束事件
    const dragTableEnd = async () => {
      const coordinate: Record<string, any> = {};
      tables.value.forEach((table: any) => {
        // eslint-disable-next-line no-param-reassign
        table.dragging = 0;
        coordinate[table.id] = table.position;
      });

      if (isRefrenceService?.value) {
        // 引用类型的服务，不允许更新
        return;
      }
      await updateConfig({
        serviceId,
        config: {
          coordinate,
        },
      });
      tables.value.forEach((table: any) => {
        // eslint-disable-next-line no-param-reassign
        table.dragging = 0;
      });
    };

    // 选中模型
    const selectTable = () => {
      const draggingTable: any = _.find('dragging')(tables.value);
      context.emit('select-change', draggingTable);
      tables.value.forEach((table: any) => {
        // eslint-disable-next-line no-param-reassign
        table.dragging = 0;
      });
    };

    // 绘制连线
    const drawRelation = async () => {
      const hoverTable = document.querySelector('.erd-table-container:hover') as HTMLElement;
      const tableIndex = Number(hoverTable.getAttribute('table-index'));
      const checkRelation = drawRelationEnd(tableIndex);
      if (checkRelation) {
        const { code } = await createRelation({
          fromModelId: _.property('id')(checkRelation[0]),
          toModelId: _.property('id')(checkRelation[1]),
          serviceId,
          relationType: 1,
        });
        if (code === 0) erdEmit('model-change', null);
      }
    };

    // 选中连线
    const selectRelation = () => {
      const hoverRelation = document.querySelector('.relation-line:hover') as HTMLElement;
      const relationIndex = Number(hoverRelation.getAttribute('relation-index'));
      const currentRelation = relations.value[relationIndex];
      const relationInfo = {
        model: tables.value[currentRelation[0]].name,
        relationModel: tables.value[currentRelation[1]].name,
        relationType: currentRelation[2],
        relationId: currentRelation[3],
        fromModelId: tables.value[currentRelation[0]].id,
        toModelId: tables.value[currentRelation[1]].id,
      };
      context.emit('select-change', { relationInfo });
      clearSelected();
      relationLines.value[relationIndex].selected = true;
    };

    // 反转关联
    const revertRelation = async () => {
      const hoverRelation = document.querySelector('.relation-line:hover') as HTMLElement;
      const index = Number(hoverRelation.getAttribute('relation-index'));
      [relations.value[index][0], relations.value[index][1]] = [relations.value[index][1], relations.value[index][0]];
      const fromIndex = relations.value[index][0];
      const toIndex = relations.value[index][1];
      const { code } = await updateRelation(String(relations.value[index][3]), {
        fromModelId: (tables.value[fromIndex] as any).id,
        toModelId: (tables.value[toIndex] as any).id,
        serviceId,
        relationType: relations.value[index][2],
      });
      if (code === 0) {
        erdEmit('model-change', null);
      }
    };

    // 重置选中状态
    const clearSelect = () => {
      clearNewRelation();
      clearSelected();
      context.emit('select-change', null);
    };

    // 鼠标离开画布事件
    const leaveErd = async () => {
      const draggingTable: any = _.find('dragging')(tables.value);
      if (draggingTable) {
        await dragTableEnd();
      }
      clearNewRelation();
      clearSelected();
    };

    // erd事件统一处理
    const handlers = {
      mouseup: async () => {
        const evType = getEventType();
        switch (evType) {
          case 'DragTable':
            await dragTableEnd();
            clearNewRelation();
            clearSelected();
            break;
          case 'ClickTable':
            selectTable();
            break;
          case 'DrawingRelation':
            await drawRelation();
            break;
          case 'RelationClick':
            selectRelation();
            break;
          case 'RelationRevert':
            revertRelation();
            selectRelation();
            break;
          default:
            clearSelect();
        }
      },
      mousedown: () => {
        const hoverTable = document.querySelector('.erd-table-container:hover');
        if (hoverTable) {
          const currentTable = tables.value[Number(hoverTable.getAttribute('table-index'))];
          tableMousedown(currentTable);
        }
      },
      mouseleave: leaveErd,
      mousemove: drag,
    };

    onMounted(() => {
      calcSvgPosition();
      const svgElem = document.querySelector('.erd-container-wrapper svg') as HTMLElement;
      const closestScroll = svgElem.closest('.el-scrollbar__wrap');
      if (closestScroll) {
        closestScroll.addEventListener('scroll', calcSvgPosition);
      }
    });
    onBeforeUnmount(() => {
      const svgElem = document.querySelector('.erd-container-wrapper svg') as HTMLElement;
      const closestScroll = svgElem.closest('.el-scrollbar__wrap');
      if (closestScroll) {
        closestScroll.removeEventListener('scroll', calcSvgPosition);
      }
    });
    const logs = (item: any) => item;
    return {
      tables,
      drag,
      tableMousedown,
      viewWidth,
      viewHeight,
      clearSelected,
      modelChange,
      allTypes,
      leaveErd,
      handlers,
      logs,
      getShowBool,
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
