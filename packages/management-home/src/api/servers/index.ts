import request from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';

export const addService: (payload: object) => Promise<SuccessResponse<any>> = (payload: object) =>
  request.post(getUrl(URL.service.ADD_SERVICE), payload);

export const updateService: (id: string, payload: object) => Promise<SuccessResponse<any>> = (
  id: string,
  payload: object,
) => request.post(getUrl(URL.service.UPDATE_SERVICE, id), payload);

export const getServiceById: (payload: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.get(getUrl(URL.service.GET_SERVICE_BY_ID, payload.id));

export const getServiceList: (payload: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.get(getUrl(URL.service.GET_SERVICE_LIST), { params: payload });

export const deleteService: (id: any) => Promise<SuccessResponse<any>> = (id: string) =>
  request.post(getUrl(URL.service.DELETE_SERVICR), { ids: id });

export const buildService: (payload: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.service.BUILD_SERVICE), payload, { timeout: 60000 });

export const initService: (payload: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.get(getUrl(URL.service.INIT_SERVICE, payload.serviceId), { timeout: 60000 });

export const getServiceApis: (id: string) => Promise<SuccessResponse<any>> = (id: string) =>
  request.get(getUrl(URL.service.GET_SERVICE_APIS), { params: { serviceId: id } });

export const updateServiceApis: (payload: object, id: string) => Promise<SuccessResponse<any>> = (
  payload: any,
  id: string,
) => request.post(getUrl(URL.service.UPDATE_SERVICE_APIS, id), payload);

export const getLogRuntime: (
  name: string,
  realtimeTs?: string | number,
  keyword?: any,
) => Promise<SuccessResponse<any>> = (name: string, realtimeTs?: string | number, keyword?: any) =>
  request.get(getUrl(URL.service.GET_LOG_RUNTIME), { params: { name, realtimeTs, keyword } });

export const getChanges: (id: any) => Promise<SuccessResponse<any>> = (id: string) =>
  request.get(getUrl(URL.service.GET_CHANGES, id));

export const getChangesApply: (serviceId: string) => Promise<SuccessResponse<any>> = (serviceId: string) =>
  request.post(getUrl(URL.service.POST_CHANGES_APPLY), { serviceId });

export const startService: (payload: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.service.START_SERVICE), payload, { timeout: 60000 });

export const stopService: (payload: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.service.STOP_SERVICE), payload, { timeout: 60000 });

export const serviceNameTest = (payload: any): Promise<SuccessResponse<any>> =>
  request.post(getUrl(URL.service.SERVICE_NAME_TEST), payload);

export const getServiceTraceId: (serviceId: any) => Promise<SuccessResponse<any>> = (serviceId: any) =>
  request.get(getUrl(URL.service.GET_SERVICE_TRACE_ID), { params: { serviceId } });
