export interface DataFieldProperty {
  name: string;
  description: string;
  type: string;
  notNull: boolean;
  unique: boolean;
  index: boolean;
  participle: boolean;
  pinyin: boolean;
  foreignId?: string;
  isSystem?: boolean;
}

export const CheckableColumns = [
  {
    prop: 'notNull',
    label: '非空',
  },
  {
    prop: 'unique',
    label: '唯一',
  },
  {
    prop: 'index',
    label: '索引',
  },
  {
    prop: 'participle',
    label: '分词',
  },
  {
    prop: 'pinyin',
    label: '拼音',
  },
];
