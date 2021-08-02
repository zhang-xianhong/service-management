import { genId } from '@/utils/util';
import { TYPE_PARAMS_TYPES } from './config';
export interface PlainObject {
  [propName: string]: any;
}

export interface ParamItem extends PlainObject {
  $id?: string;
  // 参数
  name?: string;
  // 参数类型
  type?: TYPE_PARAMS_TYPES;
  // 是否必填
  required?: number;
  // 示例
  example?: string;
  // 描述
  desc?: string;
  //  引入时关联的DTO信息
  dtoId?: number;
  //  引入类型：1. 只读，2：克隆
  importType?: number;
  // 是否只读
  readonly?: boolean;
  // 配置
  config?: PlainObject;
  // 子项
  children?: ParamItem[];
}

export type ParamItems = ParamItem[];

export const genParam = (param?: ParamItem) => ({
  name: '',
  type: 'String',
  required: 1,
  example: '',
  desc: '',
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

const getNumberValue = (example: any, config: any) => {
  let value;
  if (example !== '') {
    value = example;
  } else if (config) {
    value = config.defaultValue || config.min;
  }
  if (isNaN(Number(value))) {
    return undefined;
  }
  return Number(value);
};

const getBooleanValue = (example: any, config: any) => {
  if (example && example.toLocaleLowerCase() === 'false') {
    return false;
  }
  return example ? true : Boolean(config.defaultValue);
};

/**
 * 参数转换成示例
 * @param params
 * @param result
 * @returns
 */
export const paramsToExample = (params: ParamItems, result: any) => {
  params.forEach((item) => {
    const { name, type, example, config, children, required } = item;
    const key = name as string;
    if (!key) {
      throw new Error('参数不能为空');
    }
    let value: any;
    switch (type) {
      case 'Float':
      case 'Int32':
      case 'Int64':
      case 'Double':
        value = getNumberValue(example, config);
        break;
      case 'Boolean':
        value = getBooleanValue(example, config);
        break;
      case 'Array':
        value = [];
        break;
      case 'Object':
        value = {};
        break;
      default:
        value = example || config?.defaultValue || '';
    }
    if (value === undefined || (value === '' && required)) {
      throw new Error(`请为参数 ${name} 填写示例值或者设置默认值`);
    }
    if (Array.isArray(result)) {
      // eslint-disable-next-line no-param-reassign
      result.push(value);
    } else if (result) {
      // eslint-disable-next-line no-param-reassign
      result[key] = value;
    }
    if (type === 'Object' || (type === 'Array' && children?.length)) {
      return paramsToExample(children as ParamItems, Array.isArray(result) ? value : result[key]);
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
  if (!/^[A-Za-z_]+(\w+)?$/.test(name)) {
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
  if (example === '') {
    return false;
  }
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
    const { name, example = '', children, desc = '', $id } = params[i];
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
    const checkDescription = validDescription(desc as string);
    if (checkDescription) {
      errors.push({
        field: 'desc',
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

export interface TreeDefine {
  level: number;
  index: number;
  type: string;
  length: number;
  parent?: TreeDefine | null;
  isReadonlyImport?: boolean;
}

export interface TreeDefines {
  [id: string]: TreeDefine;
}

export const genTreeDefine = (params: ParamItems) => {
  const map: TreeDefines = {};
  const flatten = (items: ParamItems, parent: any = null, level: number) => {
    items.forEach((item, i) => {
      const define = {
        level,
        type: item.type as string,
        parent,
        index: i,
        length: 0,
        // 只读引用
        isReadonlyImport: Boolean(item.dtoId && item.importType === 1),
      };
      // eslint-disable-next-line no-param-reassign
      parent && (parent.length += 1);
      map[item.$id as string] = define;
      if (item.children && item.children.length > 0) {
        flatten(item.children, define, level + 1);
      }
    });
  };
  flatten(params, null, 0);
  return map;
};

/**
 * 将DTO转换成参数列表
 * @param dtoInfo
 * @returns
 */
export const dtoToParams = (dtoInfo: any, importType: number) => {
  const { list } = dtoInfo;
  const transform = (items: any[]) =>
    items.map((item) => {
      const newItem: ParamItem = {
        $id: genId(),
        name: item.name,
        desc: item.desc,
        type: item.type,
        children: [],
        config: item.config || {},
        required: item.required || 1,
        importType,
        dtoId: dtoInfo.uniqueId,
        readonly: importType === 1,
        dtoName: dtoInfo.name,
        serviceName: dtoInfo.serviceName,
      };
      if (item.children) {
        newItem.children = transform(item.children);
      }
      return newItem;
    });
  return transform(list);
};

/**
 * 解析存储数据
 * @param params
 * @returns
 */
export const paramsToSaveData = (params: ParamItems) => {
  const parse = (items: ParamItems) =>
    items.map((item) => {
      const newItem: any = {
        name: item.name,
        desc: item.desc,
        type: item.type,
        example: item.example,
        required: item.required,
        children: [],
        config: JSON.stringify({
          ...item.config,
          type: item.type,
        }),
      };
      if (item.dtoId) {
        newItem.dtoId = item.dtoId;
      }
      if (item.children && item.children.length) {
        newItem.children = parse(item.children);
      }
      return newItem;
    });
  return parse(params);
};
export const responseToParams = (data: any[]) => {
  const res = (data || []).filter((item) => ['Body', 'Params', 'Headers'].includes(item.paramIn));
  const listMap: any = {};
  const parseList = (items: any) =>
    items.map((item: any) => {
      const newItem: any = {
        $id: genId(),
        name: item.name,
        desc: item.desc,
        type: item.type,
        example: item.example,
        required: item.required,
        children: [],
        config: JSON.parse(item.config) || {},
        importType: item.importType,
        readonly: item.importType === 1,
        dtoName: item.dtoName,
        serviceName: item.serviceName,
      };
      if (item.dtoId) {
        newItem.dtoId = item.dtoId;
      }
      if (item.children && item.children.length) {
        newItem.children = parseList(item.children);
      }
      return newItem;
    });

  res.forEach((item) => {
    listMap[item.paramIn.toLocaleLowerCase()] = {
      contentType: item.contentType,
      list: parseList(item.list),
    };
  });

  return listMap;
};

export const parseList = (items: any) =>
  items.map((item: any) => {
    const newItem: any = {
      $id: genId(),
      name: item.name,
      desc: item.desc,
      type: item.type,
      example: item.example,
      required: item.required,
      children: [],
      config: JSON.parse(item.config) || {},
    };
    if (item.dtoId) {
      newItem.dtoId = item.dtoId;
    }
    if (item.children && item.children.length) {
      newItem.children = parseList(item.children);
    }
    return newItem;
  });
