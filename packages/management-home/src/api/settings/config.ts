import axios from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';
const { settings } = URL;

export const getConfig = (payload: any): Promise<SuccessResponse<any>> =>
  axios.get(getUrl(settings.GET_CONFIG), { params: payload });

export const addConfig = (payload: any): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(settings.ADD_CONFIG), payload);

export const updateConfig = (id: any, payload: any): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(settings.UPDATE_CONFIG, id), payload);

export const deleteConfig = (id: any): Promise<SuccessResponse<any>> => axios.post(getUrl(settings.UPDATE_CONFIG, id));

export const getConfigHistory = (id: any): Promise<SuccessResponse<any>> =>
  axios.get(getUrl(settings.GET_CONFIGHISTORY, id));

export const deliveryConfig = (payload: any): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(settings.DELIVERY_CONFIG), payload);
