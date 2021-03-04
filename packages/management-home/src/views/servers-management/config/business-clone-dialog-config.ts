import TableColumnsInterface from '@/components/packaged-table/types/table-columns-interface';
import TableButtonInterface from '@/components/packaged-table/types/table-button-interface';

export const tableColumns: Array<TableColumnsInterface> = [
  {
    prop: 'name',
    label: '服务名称',
    width: '200px',
    fixed: true,
  },
  {
    prop: 'desc',
    label: '服务描述',
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
    prop: 'tenant',
    label: '所属租户',
    width: '200px',
  },
  {
    prop: 'project',
    label: '所属项目',
    width: '600px',
  },
  {
    prop: 'modules',
    label: '服务依赖',
    width: '200px',
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
    name: 'add',
    label: '添加',
    eventName: 'add',
  },
  {
    name: 'review',
    type: 'text',
    label: '查看',
    eventName: 'review',
  },
];
