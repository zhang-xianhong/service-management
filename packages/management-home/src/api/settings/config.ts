import axios from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';
const { settings } = URL;

export const getServiceConfig = (serviceId: string): Promise<SuccessResponse<any>> =>
  axios.get(getUrl(settings.GET_SERVICECONFIG, serviceId));
export const addConfig = (payload: any): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(settings.ADD_CONFIG), payload);
export const updateConfig = (id: string, payload: any): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(settings.UPDATE_CONFIG, id), payload);
export const deleteConfig = (id: string): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(settings.DELETE_CONFIG, id));
export const getHistory = (id: string): Promise<SuccessResponse<any>> =>
  axios.get(getUrl(settings.GET_CONFIG_HISTORY, id));
export const deliveryConfig = (): Promise<SuccessResponse<any>> => axios.get(getUrl(settings.DELIVERY_CONFIG));
