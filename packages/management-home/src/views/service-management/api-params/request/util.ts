import { TYPE_PARAMS_TYPES } from './config';

/* eslint-disable no-param-reassign */
export const genId = () => (1 + Math.random() * 4294967295).toString(16);

export interface PlainObject {
  [propName: string]: any;
}

export interface ParamItem extends PlainObject {
  $id?: string;
  // 参数
  name?: string;
  // 参数类型
  type?: TYPE_PARAMS_TYPES;
  required?: number;
  // 示例
  example?: string;
  // 描述
  description?: string;
  // 配置
  config?: PlainObject;
  // 子项
  children?: ParamItem[];
}

export type ParamItems = ParamItem[];

export const genParam = (param?: ParamItem) => ({
  name: '',
  type: 'string',
  required: 1,
  example: '',
  description: '',
  config: {},
  ...param,
  $id: genId(),
});

/**
 * 查找并且更新参数
 * @param params
 * @param id
 * @param cb
 * @returns
 */
export const findAndUpdateParams = (params: ParamItems, id: string, cb: Function) => {
  const findParam = (items: ParamItems) => {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.$id === id) {
        cb(items, i, item);
        break;
      }
      if (item.children) {
        findParam(item.children);
      }
    }
  };
  findParam(params);
  return params;
};

/**
 * 参数转换成示例
 * @param params
 * @param result
 * @returns
 */
export const paramsToExample = (params: ParamItems, result: any) => {
  console.log(params);
  params.forEach((item) => {
    const { name, type, example, children } = item;
    const key = name as string;
    let value: any;
    switch (type) {
      case 'float':
      case 'int':
        value = Number(example);
        break;
      case 'boolean':
        value = true;
        break;
      case 'array':
        value = [];
        break;
      case 'object':
        value = {};
        break;
      default:
        value = example;
    }
    if (Array.isArray(result)) {
      result.push(value);
    } else {
      result[key] = value;
    }
    if (type === 'object' || (type === 'array' && children?.length)) {
      paramsToExample(children as ParamItems, result[key]);
    }
  });
  return result;
};

/**
 * 校验参数
 * @param name
 * @returns
 */
export const validName = (name: string) => {
  if (!name) {
    return '参数不能为空';
  }
  if (!/[A-Za-z_]+\w?/.test(name)) {
    return '参数仅支持字母、数字、下划线，且不能以数字开头';
  }
  if (name.length > 50) {
    return '参数最多支持50个字符';
  }
  return false;
};

/**
 * 校验示例
 * @param example
 * @returns
 */
export const validExample = (example = '') => {
  if (example?.length < 1 || example?.length > 20) {
    return '参数示例长度在1-20个字符之间';
  }
  return false;
};

/**
 * 校验描述
 * @param description
 * @returns
 */
export const validDescription = (description = '') => {
  if (description?.length > 512) {
    return '参数描述最多支持512个字符';
  }
  return false;
};

/**
 * 参数校验
 * @param params
 * @returns
 */
export const validParams = (params: ParamItems): any => {
  const errors: any = [];
  for (let i = 0, len = params.length; i < len; i++) {
    const { name, example = '', children, description = '', $id } = params[i];
    const checkName = validName(name as string);
    if (checkName) {
      errors.push({
        field: 'name',
        id: $id,
        message: checkName,
      });
      break;
    }
    const checkExample = validExample(example as string);
    if (checkExample) {
      errors.push({
        field: 'example',
        id: $id,
        message: checkExample,
      });
      break;
    }
    const checkDescription = validDescription(description as string);
    if (checkDescription) {
      errors.push({
        field: 'description',
        id: $id,
        message: checkDescription,
      });
      break;
    }
    if (children && children.length > 0) {
      return validParams(children);
    }
  }
  if (errors.length > 0) {
    return errors;
  }
  return null;
};
