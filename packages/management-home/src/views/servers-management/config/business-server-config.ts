import TableColumnsInterface from '@/components/packaged-table/types/table-columns-interface';
import TableButtonInterface from '@/components/packaged-table/types/table-button-interface';

export const tableColumns: Array<TableColumnsInterface> = [
  {
    prop: 'name',
    label: '服务名称',
    width: '200px',
    fixed: true,
    isDefault: false,
  },
  {
    prop: 'description',
    label: '服务描述',
    width: '200px',
  },
  {
    prop: 'owner',
    label: '负责人',
    width: '200px',
    isDefault: false,
  },
  {
    prop: 'status',
    label: '服务状态',
    width: '300px',
    isDefault: false,
  },
  {
    prop: 'management',
    label: '服务管理',
    width: '800px',
    isButton: true,
    buttonOptions: [
      {
        name: 'initialize',
        label: '初始化',
      },
      {
        name: 'start',
        label: '启动',
      },
      {
        name: 'stop',
        label: '停止',
      },
      {
        name: 'log',
        label: '日志',
      },
      {
        name: 'publish',
        label: '发布',
      },
      {
        name: 'test',
        label: '测试',
      },
      {
        name: 'document',
        label: '文档',
      },
      {
        name: 'fix',
        label: '修复BUG',
      },
      {
        name: 'branch',
        label: '分支',
      },
      {
        name: 'download',
        label: '扩展代码下载',
      },
    ],
  },
  {
    prop: 'pureInherited',
    label: '纯继承',
    width: '200px',
  },
  {
    prop: 'inheritedVersion',
    label: '继承版本',
    width: '200px',
  },
  {
    prop: 'category',
    label: '分类',
    width: '200px',
  },
  {
    prop: 'tag',
    label: '标签',
    width: '200px',
  },
  {
    prop: 'quality',
    label: '代码质量',
    width: '300px',
    isDefault: false,
  },
  {
    prop: 'level',
    label: '服务级别',
    width: '200px',
  },
  {
    prop: 'code',
    label: '服务代码',
    width: '400px',
    isDefault: false,
  },
  {
    prop: 'address',
    label: '服务地址',
    width: '400px',
    isButton: true,
    buttonOptions: [
      {
        name: 'address',
      },
    ],
  },
  {
    prop: 'druid',
    label: 'Druid地址',
    width: '400px',
    isButton: true,
    buttonOptions: [
      {
        name: 'address',
      },
    ],
  },
  {
    prop: 'output',
    label: '导出代码',
    width: '400px',
    isButton: true,
    buttonOptions: [
      {
        name: 'all',
        icon: 'el-icon-download',
        label: '全部',
      },
      {
        name: 'unchangeable',
        icon: 'el-icon-download',
        label: '不可修改',
      },
      {
        name: 'changeable',
        icon: 'el-icon-download',
        label: '可修改',
      },
    ],
  },
  {
    prop: 'createdBy',
    label: '创建账号',
    width: '200px',
  },
  {
    prop: 'createdTime',
    label: '创建时间',
    width: '400px',
  },
  {
    prop: 'changedByAccount',
    label: '修改账号',
    width: '200px',
  },
  {
    prop: 'changedByName',
    label: '修改姓名',
    width: '200px',
  },
  {
    prop: 'changedTime',
    label: '修改时间或启动时间',
    width: '400px',
  },
  {
    prop: 'changedCounts',
    label: '修改次数',
    width: '200px',
  },
  {
    prop: 'cloneTarget',
    label: '克隆源',
    width: '600px',
  },
];

export const tableOperations: Array<TableButtonInterface> = [
  {
    name: 'edit',
    label: '编辑',
    eventName: 'edit',
  },
  {
    name: 'delete',
    type: 'text',
    label: '删除',
    eventName: 'delete',
  },
];
