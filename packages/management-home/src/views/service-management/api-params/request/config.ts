export const getParamsMethods = ['query', 'headers'];

export const postParamsMethods = ['body', ...getParamsMethods];

export type TYPE_PARAMS_TYPES = 'string' | 'int' | 'float' | 'date' | 'boolean' | 'array' | 'object';

// 参数类型
export const PARAMS_TYPES = [
  {
    name: '字符串',
    value: 'string',
  },
  {
    name: '整数',
    value: 'int',
  },
  {
    name: '小数',
    value: 'float',
  },
  {
    name: '日期',
    value: 'date',
  },
  {
    name: '布尔型',
    value: 'boolean',
  },
  {
    name: '数组',
    value: 'array',
  },
  {
    name: '对象类型',
    value: 'object',
  },
];

/**
 * 获取参数类型名称
 * @param value
 * @returns
 */
export const getParamTypeName = (value: TYPE_PARAMS_TYPES) => {
  const param = PARAMS_TYPES.find((item) => item.value === value);
  return param?.name || '';
};
