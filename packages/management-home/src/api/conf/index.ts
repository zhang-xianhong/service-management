import request from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';

export const addClassification: (payload: object) => Promise<SuccessResponse<any>> = (payload: object) =>
  request.post(getUrl(URL.conf.ADD_CLASSIFICATION), payload);

export const updateClassification: (id: string, payload: object) => Promise<SuccessResponse<any>> = (
  id: string,
  payload: object,
) => request.post(getUrl(URL.conf.UPDATE_CLASSIFICATION, id), payload);

export const getClassificationById: (payload: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.get(getUrl(URL.conf.GET_CLASSIFICATION_DETAIL, payload.id));

export const getClassificationList: () => Promise<SuccessResponse<any>> = () =>
  request.get(getUrl(URL.conf.GET_CLASSIFICATION_LIST));

export const deleteClassification: (id: string) => Promise<SuccessResponse<any>> = (id: string) =>
  request.post(getUrl(URL.conf.DELETE_CLASSIFICATION, id));
