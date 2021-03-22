interface Point {
  x: number;
  y: number;
}
// 线段求交点
export const segmentsIntr = (a: Point, b: Point, c: Point, d: Point) => {
  // 三角形abc 面积的2倍
  const areaAbc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);

  // 三角形abd 面积的2倍
  const areaAbd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);

  // 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理);
  if (areaAbc * areaAbd >= 0) {
    return false;
  }

  // 三角形cda 面积的2倍
  const areaCda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);
  // 三角形cdb 面积的2倍
  // 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出.
  const areaCdb = areaCda + areaAbc - areaAbd;
  if (areaCda * areaCdb >= 0) {
    return false;
  }

  // 计算交点坐标
  const t = areaCda / (areaAbd - areaAbc);
  const dx = t * (b.x - a.x);
  const dy = t * (b.y - a.y);
  return { x: a.x + dx, y: a.y + dy };
};
// 获取div border
const getBorders = (d: Array<number>) => [
  [
    [d[0], d[1]],
    [d[2], d[1]],
  ],
  [
    [d[2], d[1]],
    [d[2], d[3]],
  ],
  [
    [d[2], d[3]],
    [d[0], d[3]],
  ],
  [
    [d[0], d[3]],
    [d[0], d[1]],
  ],
];

// 求线段和DIV连线
const getLinDivPoint = (d: Array<number>, l: Array<Point>) => {
  const dBorders = getBorders(d);
  for (const border of dBorders) {
    const point = segmentsIntr(
      {
        x: border[0][0],
        y: border[0][1],
      },
      {
        x: border[1][0],
        y: border[1][1],
      },
      l[0],
      l[1],
    );
    if (point) return point;
  }
  return {
    x: 0,
    y: 0,
  };
};

// 求两个Div连线
export const getDivLine = (d1: Array<number>, d2: Array<number>) => {
  const d1m: Point = {
    x: (d1[0] + d1[2]) / 2,
    y: (d1[1] + d1[3]) / 2,
  };
  const d2m: Point = {
    x: (d2[0] + d2[2]) / 2,
    y: (d2[1] + d2[3]) / 2,
  };
  const p1 = getLinDivPoint(d1, [d1m, d2m]);
  const p2 = getLinDivPoint(d2, [d1m, d2m]);
  return [p1, p2];
};
