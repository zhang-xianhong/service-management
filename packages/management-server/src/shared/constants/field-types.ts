// 支持的数据类型，Java那边会根据type和length字段自动解析为数据库数据类型
export type FIELD_TYPES = 'Integer' | 'Long' | 'Float' | 'Double' | 'Boolean' | 'String' | 'java.util.Date';
export enum ENUM_FIELD_TYPES {
  INTEGER = 'Integer',
  LONG = 'Long',
  FLOAT = 'Float',
  DOUBLE = 'Double',
  BOOLEAN = 'Boolean',
  STRING = 'String',
  JAVA_UTIL_DATE = 'java.util.Date',
}

export interface FIELD_TYPE {
  id: number | string
  type: FIELD_TYPES
  length: number
  name: string
  description: string
  isKey?: boolean
  extra?: string
}

// 合并到数据类型的结果集中
export const SYSTEM_FIELD_TYPES: FIELD_TYPE[] = [
  {
    id: '0',
    type: 'Long',
    length: 20,
    name: 'UUID',
    description: '主键ID',
    isKey: true,
    extra: 'auto_increment',
  },
];
