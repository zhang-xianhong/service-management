import request from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';

export const getImageUrl: (payload?: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.get(getUrl(URL.file.GET_IMAGE_URL), { params: payload });

/**
 * 根据身份证正面照获取身份证号
 * @param fileKey 照片key值
 */
export const getIdCard: (fileKey: string) => Promise<SuccessResponse<any>> = (fileKey: string) =>
  request.get(getUrl(URL.file.GET_IDCARD), { params: { fileKey } });

/**
 * 根据企业名称查询营业执照号
 * @param name 企业名称
 */
export const getLicense: (name: string) => Promise<SuccessResponse<any>> = (name: string) =>
  request.get(getUrl(URL.file.GET_LICENSE), { params: { name } });
