/**
 * 生成唯一ID
 * @returns
 */
export const genId = (): string => (1 + Math.random() * 4294967295).toString(16);
