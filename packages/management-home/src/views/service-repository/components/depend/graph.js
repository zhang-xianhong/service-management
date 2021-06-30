/*eslint-disable*/
import G6 from '@antv/g6';
import insertCss from 'insert-css';
import icon from './icon.svg'

const colors = {
  B: '#5B8FF9',
  R: '#F46649',
  Y: '#EEBC20',
  G: '#5BD8A6',
  DI: '#A7A7A7',
};

const props = {
  data: [],
  config: {
    padding: [0, 0],
    defaultLevel: 3,
    defaultZoom: 1,
    modes: { default: ['drag-canvas'] },
    renderer: 'svg',
  },
};

// 默认配置
const defaultConfig = {
  width: window.innerWidth,
  height: window.innerHeight,
  modes: {
    default: ['drag-canvas',],
  },
  fitView: true,
  animate: true,
  defaultNode: {
    type: 'flow-rect',
  },
  defaultEdge: {
    type: 'cubic-horizontal',
    style: {
      stroke: '#CED4D9',
      cursor: 'move'
    },
  },
  defaultCombo: {
    style: {
      cursor: 'move'
    }
  },
  style: {
    cursor: 'move'
  },
  layout: {
    type: 'compactBox',
    direction: 'LR',
    getWidth() {
      return 180;
    },
    getHeight() {
      return 40;
    },
  },
};

const registerFn = () => {
  /**
   * 自定义节点
   */
  G6.registerNode(
    'flow-rect',
    {
      shapeType: 'flow-rect',
      draw(cfg, group) {
        const { name = '', collapsed,} = cfg;
        const grey = '#CED4D9';
        // 逻辑不应该在这里判断
        const rectConfig = {
          width: 180,
          height: 40,
          lineWidth: 1,
          fontSize: 12,
          fill: '#fff',
          radius: 0,
          stroke: grey,
          opacity: 1,
          cursor: 'default',
        };

        const nodeOrigin = {
          x: -rectConfig.width / 2,
          y: -rectConfig.height / 2,
        };

        const textConfig = {
          textAlign: 'left',
          textBaseline: 'bottom',
        };

        const rect = group.addShape('rect', {
          attrs: {
            x: nodeOrigin.x,
            y: nodeOrigin.y,
            ...rectConfig,
          },
        });

        // const rectBBox = rect.getBBox();

        // label title
        group.addShape('text', {
          attrs: {
            ...textConfig,
            x: 48 + nodeOrigin.x,
            y: 28 + nodeOrigin.y,
            text: name.length > 18 ? `${name.substr(0, 18)}...` : name,
            fontSize: 12,
            opacity: 0.85,
            fill: '#000',
            cursor: 'default',
          },
          name: 'name-shape',
        });

        // icon-bg
        group.addShape('rect', {
          attrs: {
            width: 40,
            height: 40,
            x: nodeOrigin.x,
            y: nodeOrigin.y,
            fill: '#a0cfff'
          },
          name: 'icon-bg',
        })

        // icon
        group.addShape('image', {
          attrs: {
            width: 16,
            height: 16,
            x: nodeOrigin.x + 12,
            y: nodeOrigin.y + 12,
            img:icon
          },
          name: 'icon',
        })

        // collapse rect
        if (cfg.children && cfg.children.length) {
          group.addShape('rect', {
            attrs: {
              x: rectConfig.width / 2 - 8,
              y: -8,
              width: 16,
              height: 16,
              radius: 8,
              stroke: 'rgba(0, 0, 0, 0.25)',
              cursor: 'pointer',
              fill: '#fff',
            },
            name: 'collapse-back',
            modelId: cfg.id,
          });

          // collpase text
          group.addShape('text', {
            attrs: {
              x: rectConfig.width / 2,
              y: -1,
              textAlign: 'center',
              textBaseline: 'middle',
              text: collapsed ? '+' : '-',
              fontSize: 16,
              cursor: 'pointer',
              fill: 'rgba(0, 0, 0, 0.25)',
            },
            name: 'collapse-text',
            modelId: cfg.id,
          });
        }

        this.drawLinkPoints(cfg, group);
        return rect;
      },
      update(cfg, item) {
        const group = item.getContainer();
        this.updateLinkPoints(cfg, group);
      },
      setState(name, value, item) {
        if (name === 'collapse') {
          const group = item.getContainer();
          const collapseText = group.find((e) => e.get('name') === 'collapse-text');
          if (collapseText) {
            if (!value) {
              collapseText.attr({
                text: '-',
              });
            } else {
              collapseText.attr({
                text: '+',
              });
            }
          }
        }
      },
      getAnchorPoints() {
        return [
          [0, 0.5],
          [1, 0.5],
        ];
      },
    },
    'rect',
  );

  G6.registerEdge(
    'flow-cubic',
    {
      getControlPoints(cfg) {
        let { controlPoints } = cfg; // 指定controlPoints
        if (!controlPoints || !controlPoints.length) {
          const { startPoint, endPoint, sourceNode, targetNode } = cfg;
          const { x: startX, y: startY, coefficientX, coefficientY } = sourceNode ? sourceNode.getModel() : startPoint;
          const { x: endX, y: endY } = targetNode ? targetNode.getModel() : endPoint;
          let curveStart = (endX - startX) * coefficientX;
          let curveEnd = (endY - startY) * coefficientY;
          curveStart = curveStart > 40 ? 40 : curveStart;
          curveEnd = curveEnd < -30 ? curveEnd : -30;
          controlPoints = [
            { x: startPoint.x + curveStart, y: startPoint.y },
            { x: endPoint.x + curveEnd, y: endPoint.y },
          ];
        }
        return controlPoints;
      },
      getPath(points) {
        const path = [];
        path.push(['M', points[0].x, points[0].y]);
        path.push(['C', points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y]);
        return path;
      },
    },
    'single-line',
  );
};

let graph = null;

const initGraph = (container, data) => {
  if (!data) {
    return;
  }
  const { onInit, config } = props;
  const tooltip = new G6.Tooltip({
    // offsetX and offsetY include the padding of the parent container
    offsetX: 20,
    offsetY: 30,
    // the types of items that allow the tooltip show up
    // 允许出现 tooltip 的 item 类型
    itemTypes: ['node'],
    container,
    // custom the tooltip's content
    // 自定义 tooltip 内容
    getContent: (e) => {
      const outDiv = document.createElement('div');
      // outDiv.style.padding = '0px 0px 20px 0px';
      const nodeName = e.item.getModel().name;
      let formatedNodeName = '';
      for (let i = 0; i < nodeName.length; i++) {
        formatedNodeName = `${formatedNodeName}${nodeName[i]}`;
        if (i !== 0 && i % 20 === 0) {
          formatedNodeName = `${formatedNodeName}<br/>`;
        }
      }
      outDiv.innerHTML = `${formatedNodeName}`;
      return outDiv;
    },
    shouldBegin: (e) => {
      if (e.target.get('name') === 'name-shape') return true;
      return false;
    },
  });

  const minimap = new G6.Minimap({
    size: [150, 100],
  });

  let { width, height } = defaultConfig;
  width = container.clientWidth || width;
  height = container.clientHeight || height || 400;
  console.log(container.clientWidth, container.clientHeight);
  // const toolbar = new G6.ToolBar({
  //   position: { x: width - 1000, y: 60 },
  // });
  graph = new G6.TreeGraph({
    container,
    ...defaultConfig,
    ...config,
    width,
    height,
    plugins: [tooltip, minimap],
    enabledStack: false,
    
  });
  if (typeof onInit === 'function') {
    onInit(graph);
  }

  graph.data(data);
  graph.render();
  graph.zoom(config.defaultZoom || 1);
  graph.fitCenter()

  const handleCollapse = (e) => {
    const { target } = e;
    const id = target.get('modelId');
    const item = graph.findById(id);
    const nodeModel = item.getModel();
    nodeModel.collapsed = !nodeModel.collapsed;
    graph.layout();
    graph.setItemState(item, 'collapse', nodeModel.collapsed);
  };
  graph.on('collapse-text:click', (e) => {
    handleCollapse(e);
  });
  graph.on('collapse-back:click', (e) => {
    handleCollapse(e);
  });

  // SVG画布的鼠标设置为move
  graph.on('node:mouseleave', (e) => {
    try {
      graph.get('canvas').cfg.el.style.cursor = 'move'
    } catch (error) {
      console.log(e, error)
    }
  });
};

export default (container, data) => {
  insertCss(`
  .g6-component-tooltip {
    background-color: rgba(0,0,0, 0.65);
    padding: 10px;
    box-shadow: rgb(174, 174, 174) 0px 0px 10px;
    width: fit-content;
    color: #fff;
    border-radius: 4px;
  }
`);

  graph = null;
  registerFn();
  initGraph(container, data);

  const resizeHandler = () => {
    if (!graph || graph.get('destroyed')) return;
    if (!container || !container.scrollWidth || !container.scrollHeight) return;
    graph.changeSize(container.scrollWidth, container.scrollHeight);
  };

  // window.addEventListener('resize', resizeHandler);

  return {
    graph,
    render(data) {
      if (!graph) {
        return;
      }
      graph.data(data);
      graph.render();
    },
    destroy() {
      try {
        graph.destroy();
      } catch (error) {
        console.log(error);
      } finally {
        window.removeEventListener('resize', resizeHandler);
      }
    },
  };
};
