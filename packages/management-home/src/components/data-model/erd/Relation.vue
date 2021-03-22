<template>
  <svg>
    <defs>
      <marker id="triangle" markerUnits="strokeWidth" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
        <path d="M 0 0 L 5 2 L 0 4 z" fill="#000" />
      </marker>
      <marker id="circle" markerUnits="strokeWidth" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
        <circle cx="5" cy="5" r="2" fill="#000" />
      </marker>
      <marker
        id="triangle-hover"
        markerUnits="strokeWidth"
        markerWidth="5"
        markerHeight="4"
        refX="4"
        refY="2"
        orient="auto"
      >
        <path d="M 0 0 L 5 2 L 0 4 z" fill="#006EFF" />
      </marker>
      <marker
        id="circle-hover"
        markerUnits="strokeWidth"
        markerWidth="10"
        markerHeight="10"
        refX="5"
        refY="5"
        orient="auto"
      >
        <circle cx="5" cy="5" r="2" fill="#006EFF" />
      </marker>
    </defs>
    <g
      v-for="(line, $index) in relationLines.filter((item) => !isNaN(item.startMarker.x))"
      :key="$index"
      :class="{ selected: line.selected, 'no-revert': line.noRevert }"
      @click="selectLine(line)"
    >
      <path :d="line.path" stroke-width="1" fill="none"></path>
      <circle :cx="line.startMarker.x" :cy="line.startMarker.y" r="10" fill="#fff"></circle>
      <text v-bind="line.startMarker" text-anchor="middle" dy="8" font-size="16">*</text>
      <circle :cx="line.endMarker.x" :cy="line.endMarker.y" r="10" fill="#fff"></circle>
      <text v-bind="line.endMarker" text-anchor="middle" dy="4" font-size="10">1</text>
      <g
        :transform="`translate(${line.middleMarker.x - 8} ${line.middleMarker.y - 18}) scale(0.015 0.015)`"
        @click="revertRelation($index)"
      >
        <circle stroke-width="50" cx="500" cy="500" r="800" fill="#fff"></circle>
        <path d="M320 704h704v128h-704v160l-224-224 224-224v160z"></path>
        <path d="M704 320h-704v-128h704v-160l224 224-224 224z"></path>
      </g>
    </g>
    <line
      stroke="#000"
      stroke-width="1"
      stroke-dasharray="2 4"
      v-if="~newRelationLine[0][0] && ~newRelationLine[1][0]"
      :x1="newRelationLine[0][0]"
      :y1="newRelationLine[0][1]"
      :x2="newRelationLine[1][0]"
      :y2="newRelationLine[1][1]"
    ></line>
    <path
      stroke="#000"
      stroke-width="1"
      stroke-dasharray="2 4"
      :d="tempLinePath"
      v-if="~tempRelation"
      fill="transparent"
    ></path>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { relationLines, relations, clearSelected, newRelationLine, tempLinePath, tempRelation } from './store';
export default defineComponent({
  name: 'ErdRelation',
  setup() {
    const revertRelation = (index: number) => {
      relations.value[index].reverse();
    };
    const selectLine = (line: any) => {
      clearSelected();
      // eslint-disable-next-line no-param-reassign
      line.selected = true;
    };
    return {
      relationLines,
      revertRelation,
      selectLine,
      newRelationLine,
      tempLinePath,
      tempRelation,
    };
  },
});
</script>

<style lang="scss" scoped>
svg {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  user-select: none;
  & > g {
    stroke: #666;
    cursor: pointer;
    marker-end: url(#triangle);
    marker-start: url(#circle);
    &:hover,
    &.selected {
      stroke: #0595db;
      marker-end: url(#triangle-hover);
      marker-start: url(#circle-hover);
    }
    &.selected:not(.no-revert) > g path {
      fill: #0595db;
    }
    & > g {
      circle,
      path {
        stroke: none;
        fill: transparent;
      }
    }
  }
}
</style>
