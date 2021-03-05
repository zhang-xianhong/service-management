// 数据对象管理页面表格列配置

import TableColumnsInterface from '@/components/packaged-table/types/table-columns-interface';
import TableButtonInterface from '@/components/packaged-table/types/table-button-interface';

export const tableColumns: Array<TableColumnsInterface> = [
  {
    prop: 'name',
    label: '数据名称',
    width: 200,
    sortable: true,
    fixed: true,
    isDefault: false,
  },
  {
    prop: 'description',
    label: '对象描述',
    width: 200,
  },
  {
    prop: 'owner',
    label: '负责人',
    width: 150,
  },
  {
    prop: 'isAllByExtend',
    label: '纯继承',
    width: 100,
  },
  {
    prop: 'modelRank',
    label: '对象级别',
    width: 100,
  },
  {
    prop: 'classification',
    label: '分类',
    width: 200,
  },
  {
    prop: 'tags',
    label: '标签',
    width: 200,
  },
  {
    prop: 'createdAccount',
    label: '创建账号',
    width: 200,
  },
  {
    prop: 'createdName',
    label: '创建姓名',
    width: 200,
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 200,
    isDate: true,
  },
  {
    prop: 'changedByAccount',
    label: '修改账号',
    width: 200,
  },
  {
    prop: 'updateUser',
    label: '修改姓名',
    width: 200,
  },
  {
    prop: 'updateTime',
    label: '修改时间或启动时间',
    width: 400,
    isDate: true,
  },
  {
    prop: 'version',
    label: '修改次数',
    width: 200,
  },
  {
    prop: 'similarObject',
    label: '相似对象',
    width: 200,
  },
  {
    prop: 'similarity',
    label: '相似度',
    width: 200,
  },
  {
    prop: 'cloneBy',
    label: '克隆源',
    width: 200,
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
