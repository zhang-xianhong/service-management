// 支持的数据类型，Java那边会根据type和length字段自动解析为数据库数据类型
export enum FIELD_TYPES {
  INTEGER = 'Integer',
  LONG = 'Long',
  FLOAT = 'Float',
  DOUBLE = 'Double',
  BOOLEAN = 'Boolean',
  STRING = 'String',
  JAVA_UTIL_DATE = 'java.util.Date',
}

export interface FIELD_TYPE {
  type: FIELD_TYPES
  length: number
  name: string
  id?: number | string
  description: string
  typeId?: number
  isSystem?: boolean
  isUnique?: boolean
  isIndex?: boolean
  isKey?: boolean
  extra?: string
}

// 合并到数据类型的结果集中
export const SYSTEM_FIELD_TYPES: FIELD_TYPE[] = [
  {
    id: '0',
    type: FIELD_TYPES.LONG,
    length: 20,
    name: 'UUID',
    description: '主键ID',
    isKey: true,
    extra: 'auto_increment',
  },
];

export const FIELD_UUID_NAME = 'UUID';

// 默认要生成的字段
export const DEFAULT_FIELDS = [
  {
    name: 'id',
    type: 'UUID', // 根据该类型去data-type表中查找typeID
    isKey: true,
    isUnique: true,
    isIndex: true,
    isSystem: true,
    extra: 'auto_increment',
  },
];
