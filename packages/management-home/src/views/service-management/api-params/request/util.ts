import { TYPE_PARAMS_TYPES } from './config';

/* eslint-disable no-param-reassign */
export const genId = () => (1 + Math.random() * 4294967295).toString(16);

export interface PlainObject {
  [propName: string]: any;
}

export interface ParamItem extends PlainObject {
  $id?: string;
  name?: string;
  type?: TYPE_PARAMS_TYPES;
  required?: number;
  example?: string;
  description?: string;
  children?: ParamItem[];
}

export type ParamItems = ParamItem[];

export const genParam = (param?: ParamItem) => ({
  name: '',
  type: 'string',
  required: 1,
  example: '',
  description: '',
  ...param,
  $id: genId(),
});

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
export const paramsToExample = (params: ParamItems, result: any) => {
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
