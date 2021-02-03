/**
 * isUndefined
 * @param value
 */
export const isUndefined = (value: unknown): boolean => typeof value === 'undefined';

/**
 * is null
 * @param value
 */
export const isNull = (value: unknown): boolean => value === null;


/**
 * 字符串是否为空
 * @param value
 * @param ignoreWhitespace
 */
export const isEmpty = (value: unknown, ignoreWhitespace = false): boolean => {
  if (isUndefined(value) || isNull(value)) {
    return false;
  }
  const string = String(value);
  return ignoreWhitespace ? string.trim().length === 0 : string.length === 0;
};


/**
 * 判断是否是空数组或空对象
 * @param value
 */
export const isEmptyObject = (value: unknown): boolean => {
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (typeof value === 'object' && !isNull(value)) {
    return Object.keys(value).length === 0;
  }
  return false;
};


/**
 * 判断字符串中是否包含指定字符
 * @param value
 * @param element
 * @param ignoreCase
 */
export const contains = (value: string, element: string, ignoreCase = false): boolean => {
  if (typeof value === 'string') {
    const elementStr = String(element);
    return ignoreCase ? value.toLowerCase().indexOf(elementStr.toLowerCase()) >= 0 : value.indexOf(elementStr) >= 0;
  }
  return false;
};


/**
 * 是不是数字（数字字符串）
 * @param value
 */
export const isNumeric = (value: unknown): boolean => {
  if (isUndefined(value) || isNull(value) || isEmpty(value)) {
    return false;
  }
  return !isNaN(Number(value));
};
