import request from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';

export const addService: (payload: object) => Promise<SuccessResponse<any>> = (payload: object) =>
  request.post(getUrl(URL.service.ADD_SERVICE), payload);

export const getServiceById: (payload: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.get(getUrl(URL.service.GET_SERVICE_BY_ID, payload.id));
