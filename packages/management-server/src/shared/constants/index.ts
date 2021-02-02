import getConfig from '../../config';
const { TRACE_ID_NAME } = getConfig();

// traceId
export const HEADER_TRACE_NAME: string = TRACE_ID_NAME || 'x-trace-id';


// 默认分页显示条数
export const DEFAULT_PAGE_SIZE = 10;
