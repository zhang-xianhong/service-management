import { escape } from 'mysql2';

export type LikePattern = '%value%' | '%value' | 'value%';

/**
 * 转义模糊查询
 * 防止注入
 * @param keyword
 * @param pattern
 * @returns
 */
export const escapeLike = (keyword: string, pattern: LikePattern = '%value%') => {
  const value = escape(keyword);
  return pattern.replace('value', value);
};


