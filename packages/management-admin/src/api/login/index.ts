import request from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';

export const getCaptcha: () => Promise<SuccessResponse<any>> = () => request.get(getUrl(URL.login.GET_CAPTCHA));

export const login: (payload: any) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.login.LOGIN), payload);
