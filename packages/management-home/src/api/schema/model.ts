import axios from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { DataListResponse } from '@/types/response';
const { schema } = URL;

export const getModelList = (payload?: object): Promise<DataListResponse> =>
  axios.get(getUrl(schema.GET_MODEL_LIST), {
    params: payload,
  });

export const getModelListAll = (payload?: object): Promise<DataListResponse> =>
  axios.get(getUrl(schema.GET_MODEL_LIST_ALL), {
    params: payload,
  });

export const getModelDetail = (id: number) => axios.get(`${getUrl(schema.GET_MODEL_DETAIL)}/${id}`);

export const createModel = (payload: object) => axios.post(getUrl(schema.CREATE_MODEL), payload);

export const updateModel = (payload: object, id: number) => axios.post(`${getUrl(schema.UPDATE_MODEL)}/${id}`, payload);
