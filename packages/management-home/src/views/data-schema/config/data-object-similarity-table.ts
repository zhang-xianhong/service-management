// 数据对象相似度分析页面表格列配置

import TableColumnsInterface from '@/components/packaged-table/types/table-columns-interface';

export const tableColumns: Array<TableColumnsInterface> = [
  {
    prop: 'name',
    label: '名称',
    width: 200,
    isDefault: false,
  },
  {
    prop: 'description',
    label: '描述',
  },
  {
    prop: 'projectName',
    label: '项目名称',
    width: 350,
  },
  {
    prop: 'user',
    label: '租户名称',
    width: 200,
  },
  {
    prop: 'similarity',
    label: '相似度',
    width: 100,
  },
  {
    prop: 'classification',
    label: '分类',
    width: 200,
  },
  {
    prop: 'objectPropertyNum',
    label: '对象字段数',
    width: 200,
  },
  {
    prop: 'samePropertyNum',
    label: '相同字段数',
    width: 200,
  },
];
