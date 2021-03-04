// 字母
export const REG_ALPHA = /^[A-Za-z]+$/;

// 字母数字
export const REG_ALPHA_NUM = /^[A-Za-z0-9]+$/;

// 字母数字下划线中横线
export const REG_ALPHA_DASH = /^[A-Za-z0-9\-\\_]+$/;

// 中文
export const REG_CHS = /^[\u4E00-\u9FA5\uF900-\uFA2D]+$/;

// 中文字母
export const REG_CHS_ALPHA = /^[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z]+$/;

// 中文字母数字
export const REG_CHS_ALPHA_NUM = /^[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z0-9]+$/;

// 中文字母数字中横线
export const REG_CHS_DASH = /^[\u4E00-\u9FA5\uF900-\uFA2DA-Za-z0-9\-\\_]+$/;

// 邮箱
export const REG_EMAIL = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;

// url
export const REG_URL = /^(http(?:|s)\\:)*\/\/([^\\/]+)/;

// 日期
export const REG_DATE = /^\d{4}(-|\/)\d{1,2}(-|\/)\d{1,2}$/;


// 大驼峰
export const REG_UPPER_CAMEL_CASE = /^([A-Z][a-z]+)+$/;

// 小驼峰
export const REG_LOWER_CAMEL_CASE = /^([a-z]|[a-z]+[A-Z][a-z]+)+$/;
