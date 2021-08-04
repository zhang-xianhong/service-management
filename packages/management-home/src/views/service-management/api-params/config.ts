export const getParamsMethods = ['query', 'headers'];

export const postParamsMethods = ['body', ...getParamsMethods];

export type TYPE_PARAMS_TYPES =
  | 'String'
  | 'Int32'
  | 'Int64'
  | 'Float'
  | 'Double'
  | 'Date'
  | 'Boolean'
  | 'Array'
  | 'Object';

const PARAMS_TYPE_STRING = {
  name: '字符串',
  value: 'String',
};
const PARAMS_TYPE_INT32 = {
  name: '整数(int32)',
  value: 'Int32',
};
const PARAMS_TYPE_INT64 = {
  name: '长整数(int64)',
  value: 'Int64',
};
const PARAMS_TYPE_FLOAT = {
  name: '单精度(float)',
  value: 'Float',
};
const PARAMS_TYPE_DOUBLE = {
  name: '双精度(double)',
  value: 'Double',
};
const PARAMS_TYPE_DATE = {
  name: '日期',
  value: 'Date',
};
const PARAMS_TYPE_BOOLEAN = {
  name: '布尔型',
  value: 'Boolean',
};
const PARAMS_TYPE_ARRAY = {
  name: '数组',
  value: 'Array',
};
const PARAMS_TYPE_OBJECT = {
  name: '对象类型',
  value: 'Object',
};
const PARAMS_TYPE_FILE = {
  name: '文件类型',
  value: 'File',
};

// 参数类型
export const PARAMS_TYPES = [
  PARAMS_TYPE_STRING,
  PARAMS_TYPE_INT32,
  PARAMS_TYPE_INT64,
  PARAMS_TYPE_FLOAT,
  PARAMS_TYPE_DOUBLE,
  PARAMS_TYPE_DATE,
  PARAMS_TYPE_BOOLEAN,
  PARAMS_TYPE_ARRAY,
  PARAMS_TYPE_OBJECT,
  PARAMS_TYPE_FILE,
];

// 用于get、delete、header的参数类型
export const PARAMS_TYPES_QUERY = [
  PARAMS_TYPE_STRING,
  PARAMS_TYPE_INT32,
  PARAMS_TYPE_INT64,
  PARAMS_TYPE_FLOAT,
  PARAMS_TYPE_DOUBLE,
  PARAMS_TYPE_DATE,
  PARAMS_TYPE_BOOLEAN,
  PARAMS_TYPE_ARRAY,
];

export const PARAMS_TYPE_BODY = [...PARAMS_TYPES_QUERY, PARAMS_TYPE_OBJECT];

// form-data
export const PARAMS_TYPE_FORM_DATA = [PARAMS_TYPE_STRING, PARAMS_TYPE_FILE];

// 返回参数
export const PARAMS_TYPE_RESPONSE = [
  PARAMS_TYPE_STRING,
  PARAMS_TYPE_INT32,
  PARAMS_TYPE_INT64,
  PARAMS_TYPE_FLOAT,
  PARAMS_TYPE_DOUBLE,
  PARAMS_TYPE_DATE,
  PARAMS_TYPE_BOOLEAN,
  PARAMS_TYPE_ARRAY,
  PARAMS_TYPE_OBJECT,
];

/**
 * 请求头
 */
export const CONTENT_TYPES = ['json', 'x-www-form-urlencoded', 'form-data'];

/**
 * 获取参数类型名称
 * @param value
 * @returns
 */
export const getParamTypeName = (value: TYPE_PARAMS_TYPES) => {
  const param = PARAMS_TYPES.find((item) => item.value === value);
  return param?.name || '';
};
