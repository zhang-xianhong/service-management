import axios from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { DataListResponse, SuccessResponse } from '@/types/response';
const { schema } = URL;

export const getModelList = (payload?: object): Promise<DataListResponse> =>
  axios.get(getUrl(schema.GET_MODEL_LIST), {
    params: payload,
  });

export const getModelListAll = (payload?: object): Promise<SuccessResponse<any>> =>
  axios.get(getUrl(schema.GET_MODEL_LIST_ALL), {
    params: payload,
  });

export const getServiceModelList = (payload?: object): Promise<SuccessResponse<any>> =>
  axios.get(getUrl(schema.GET_SERVICE_MODEL_LIST), {
    params: payload,
  });
export const getModelDetail = (id: number) => axios.get(`${getUrl(schema.GET_MODEL_DETAIL)}/${id}`);

export const createModel = (payload: object): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(schema.CREATE_MODEL), payload);

export const updateModel = (payload: object, id: number): Promise<SuccessResponse<any>> =>
  axios.post(`${getUrl(schema.UPDATE_MODEL)}/${id}`, payload);

export const deleteModel = (payload: object): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(schema.DELETE_MODEL), payload);

export const createRelation = (payload: object): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(schema.CREATE_RELATION), payload);

export const updateRelation = (relationId: string, payload: object): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(schema.UPDATE_RELATION, relationId), payload);

export const updateConfig = (payload: object): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(schema.UPDATE_CONFIG), payload);

export const updateFields = (modelId: string, payload: object): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(schema.UPDATE_FIELDS, modelId), payload);
