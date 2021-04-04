import getConfig from '../../config';
const { TRACE_ID_NAME } = getConfig();

// traceId
export const HEADER_TRACE_NAME: string = TRACE_ID_NAME || 'x-trace-id';

// 默认分页显示条数
export const DEFAULT_PAGE_SIZE = 10;

// 日期时间格式化格式
export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const OCR_COMMON_CONFIG = {
  Action: 'IDCardOCR',
  Version: '20181119',
  Region: 'ap-beijing',
  CardSide: 'FRONT',
};
