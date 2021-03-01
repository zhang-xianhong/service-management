export const Columns = [
  {
    prop: 'name',
    label: '属性名称',
    minWidth: 100,
    fixed: true,
    formatter(row: any, column: any, cellValue: any, index: number) {
      console.log(row, column, cellValue, index);
    },
  },
  {
    prop: 'description',
    label: '属性描述',
    minWidth: 100,
  },
  {
    prop: 'createUser',
    label: '数据类型',
    minWidth: 100,
  },
  {
    prop: 'createTime',
    label: '非空',
    minWidth: 60,
  },
  {
    prop: 'createTime',
    label: '唯一',
    minWidth: 60,
  },
  {
    prop: 'createTime',
    label: '索引',
    minWidth: 60,
  },
  {
    prop: 'createTime',
    label: '分词',
    minWidth: 60,
  },
  {
    prop: 'createTime',
    label: '拼音',
    minWidth: 60,
  },
  {
    prop: 'updateUser',
    label: '关联数据对象',
    minWidth: 100,
  },
];
