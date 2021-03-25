import axios from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';
const { settings } = URL;

export const getDataTypes = (payload: any): Promise<SuccessResponse<any>> =>
  axios.get(getUrl(settings.GET_DATA_TYPES), { params: payload });
export const getDataTypesAll = (): Promise<SuccessResponse<any>> => axios.get(getUrl(settings.GET_DATA_TYPES_ALL));
export const addDataType = (payload: any) => axios.post(getUrl(settings.ADD_DATA_TYPE), payload);
export const updateDataType = (id: string, payload: any) => axios.post(getUrl(settings.UPDATE_DATA_TYPE, id), payload);
export const getDataTypeDetail = (id: string) => axios.get(getUrl(settings.UPDATE_DATA_TYPE, id));
export const deleteDataType = (payload: any) => axios.post(getUrl(settings.DELETE_DATA_TYPE), payload);
