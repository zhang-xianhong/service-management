import getConfig from '../../config';
import * as path from 'path';
const { TRACE_ID_NAME, UPLOAD_FILE_STORAGE } = getConfig();;

// traceId
export const HEADER_TRACE_NAME: string = TRACE_ID_NAME || 'x-trace-id';

// 文件上传存储
export const  UPLOAD_STORAGE: string = UPLOAD_FILE_STORAGE || 'local';

// 默认分页显示条数
export const DEFAULT_PAGE_SIZE = 10;

// 日期时间格式化格式
export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

// 限制文件上传大小
export const FILE_MAX_SIZE = 10 * 1024 * 1024;

export const OCR_COMMON_CONFIG = {
  Action: 'IDCardOCR',
  Version: '20181119',
  Region: 'ap-beijing',
  CardSide: 'FRONT',
};


// 支持的最大上传文件大小，单位是M
export const UPLOAD_MAX_FILE_SIZE = Math.pow(1024, 2) * 10;

// 允许上传的文件格式
export const UPLOAD_ALLOW_EXTS = [
  'jpg',
  'jpeg',
  'png',
  'webp',
  'gif',
  'pdf',
  'zip',
  'rar',
  'txt',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'doc',
  'docx',
];

// 根目录
export const ROOT_PATH = path.resolve(__dirname, '../../');

// 上传目录名称
export const UPLOAD_DIR_NAME = 'upload';
