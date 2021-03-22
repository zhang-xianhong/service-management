import { ref, Ref } from 'vue';
import _ from 'lodash/fp';
import { getDivLine } from './util';

interface Column {
  name: string;
  description: string;
  type: string;
  notNull: boolean;
  unique: boolean;
  segment: boolean;
  pinyin: boolean;
  relateTable?: number;
  relateColumn?: number;
}
export interface Table {
  name: string;
  description: string;
  owner: number;
  tag: number;
  classification: number;
  columns: Array<Column>;
  position: {
    x: number;
    y: number;
  };
  dragging?: boolean;
  selected?: boolean;
}
interface Line {
  startMarker?: {
    x: number;
    y: number;
  };
  endMarker?: {
    x: number;
    y: number;
  };
  middleMarker?: {
    x: number;
    y: number;
  };
  path: string;
  selected?: boolean;
  noRevert?: boolean;
}
type Relation = Array<number>;
export const tables: Ref<Array<Table>> = ref([]);
export const relations: Ref<Array<Relation>> = ref([]);
export const relationLines: Ref<Array<Line>> = ref([]);
export const viewWidth = ref(0);
export const viewHeight = ref(0);

const getPos = (index: number) => [tables.value[index].position.x, tables.value[index].position.y];
const getTableHeight = (index: number) => tables.value[index].columns.length * 30 + 48;
const getLinePosition = (startPos: Array<number>, endPos: Array<number>, startIndex: number, endIndex: number) => {
  if (startIndex === endIndex) {
    return {
      startMarker: {
        x: startPos[0] + 15,
        y: startPos[1] - 18,
      },
      endMarker: {
        x: startPos[0] - 20,
        y: startPos[1] + 15,
      },
      middleMarker: {
        x: startPos[0] + 210,
        y: startPos[1] + 10,
      },
      path: `M ${startPos[0] + 20} ${startPos[1]} A 25 25 0 1 0 ${startPos[0]} ${startPos[1] + 20}`,
      noRevert: true,
    };
  }
  const line = getDivLine(
    [...startPos, startPos[0] + 200, startPos[1] + getTableHeight(startIndex)],
    [...endPos, endPos[0] + 200, endPos[1] + getTableHeight(endIndex)],
  );
  const dist = Math.sqrt((line[1].x - line[0].x) ** 2 + (line[1].y - line[0].y) ** 2);
  const dirX = (line[1].x - line[0].x) / dist;
  const dirY = (line[1].y - line[0].y) / dist;
  return {
    startMarker: {
      x: dirX * 30 + line[0].x,
      y: dirY * 30 + line[0].y,
    },
    endMarker: {
      x: dirX * -40 + line[1].x,
      y: dirY * -40 + line[1].y,
    },
    middleMarker: {
      x: (line[0].x + line[1].x) / 2,
      y: (line[0].y + line[1].y) / 2,
    },
    path: `M ${line[0]?.x} ${line[0]?.y} L ${line[1]?.x} ${line[1]?.y}`,
    noRevert: false,
  };
};
export const getLines = () =>
  _.map(([start, end]) => {
    const startPos = getPos(start);
    const endPos = getPos(end);
    return getLinePosition(startPos, endPos, start, end);
  })(relations.value);

export const recalcCanvasSize = () => {
  const maxX = Math.max(..._.map('position.x')(tables.value));
  viewWidth.value = maxX + 220;
  const maxY = Math.max(..._.map((table: Table) => table.position.y + table.columns.length * 30 + 48)(tables.value));
  viewHeight.value = maxY + 20;
};
export const move = (index: number, movementX: number, movementY: number): void => {
  const xPos = tables.value[index].position.x + movementX;
  const yPos = tables.value[index].position.y + movementY;
  tables.value[index].position.x = xPos;
  tables.value[index].position.y = yPos;
  recalcCanvasSize();
  relations.value.forEach((relation, rIndex) => {
    if (relation.includes(index)) {
      const start = tables.value[relation[0]].position;
      const end = tables.value[relation[1]].position;
      const startPos = [start.x, start.y];
      const endPos = [end.x, end.y];
      relationLines.value[rIndex] = getLinePosition(startPos, endPos, relation[0], relation[1]);
    }
  });
};

export const clearSelected = () => {
  [...tables.value, ...relationLines.value].forEach((item: any) => {
    // eslint-disable-next-line no-param-reassign
    item.selected = false;
  });
};

export const drawingRelation = ref(false);
export const tempRelation = ref(-1);
export const newRelation = ref([-1, -1]);
export const newRelationLine = ref([
  [-1, -1],
  [-1, -1],
]);
export const drawRelationStart = (ev: MouseEvent, index: number) => {
  drawingRelation.value = true;
  newRelationLine.value[0] = [ev.clientX, ev.clientY];
  newRelation.value[0] = index;
};
export const tempLinePath = ref('');
const drawTempLine = (startIndex: number, endIndex: number) => {
  newRelationLine.value[1] = [-1, -1];
  const tempLinePosition = getLinePosition(getPos(startIndex), getPos(endIndex), startIndex, endIndex);
  tempLinePath.value = tempLinePosition.path;
};
export const draw = (ev: MouseEvent) => {
  if (!~tempRelation.value) {
    newRelationLine.value[1] = [ev.clientX, ev.clientY];
  } else {
    drawTempLine(newRelation.value[0], tempRelation.value);
  }
};
export const clearNewRelation = () => {
  drawingRelation.value = false;
  newRelationLine.value = [
    [-1, -1],
    [-1, -1],
  ];
  newRelation.value = [-1, -1];
};
const checkRelation = () => {
  const isDrawing = drawingRelation.value;
  const newRelationString = JSON.stringify(newRelation.value);
  const reverseRelationString = JSON.stringify([newRelation.value[1], newRelation.value[0]]);
  const relationsString = JSON.stringify(relations.value);
  const duplicate = ~relationsString.indexOf(newRelationString) || ~relationsString.indexOf(reverseRelationString);
  return isDrawing && !duplicate;
};
export const drawRelationEnd = (index: number) => {
  newRelation.value[1] = index;
  if (checkRelation()) {
    relations.value.push([...newRelation.value]);
  }
  clearNewRelation();
};

export const drawTempRleation = (index: number) => {
  if (drawingRelation.value) {
    tempRelation.value = index;
  }
};

export const removeTempRleation = () => {
  tempRelation.value = -1;
};
