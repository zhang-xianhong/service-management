import request from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';

export const addClassification: (payload: object) => Promise<SuccessResponse<any>> = (payload: object) =>
  request.post(getUrl(URL.settings.ADD_CLASSIFICATION), payload);

export const updateClassification: (payload: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.settings.UPDATE_CLASSIFICATION, payload.id), payload);

export const getClassificationById: (payload: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.get(getUrl(URL.settings.GET_CLASSIFICATION_DETAIL, payload.id));

export const getClassificationList: () => Promise<SuccessResponse<any>> = () =>
  request.get(getUrl(URL.settings.GET_CLASSIFICATION_LIST));

export const deleteClassification: (id: number) => Promise<SuccessResponse<any>> = (id: number) =>
  request.post(getUrl(URL.settings.DELETE_CLASSIFICATION, String(id)));
