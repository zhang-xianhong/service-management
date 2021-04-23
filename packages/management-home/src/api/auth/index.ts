import request from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';

export const checkHealth: () => Promise<SuccessResponse<any>> = () => request.get(getUrl(URL.auth.GET_HEALTH));

export const getUserInfo: () => Promise<SuccessResponse<any>> = () => request.get(getUrl(URL.auth.GET_USER_MESSAGE));

export const postCurrentProject: (payload: any) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.auth.POST_CURRENT_PROJECT), payload);
