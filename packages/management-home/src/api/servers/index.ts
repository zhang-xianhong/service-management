import request from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';
import SERVER_TYPES from '@/shared/servertype';
import service from '@/shared/constant/url/service';
import { apiProxy } from '../proxy/proxy';
import { DtoModel, DtoApiParams, CreatDtoModel } from '@/views/service-management/dto/dto';
import { ServiceSnashot } from '@/views/service-management/business-service/components/release';

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

export const getServiceDependencyList: (payload: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.get(getUrl(URL.service.GET_SERVICE_DEPENDENCY_LIST), { params: payload });

export const deleteService: (id: any) => Promise<SuccessResponse<any>> = (id: string) =>
  request.post(getUrl(URL.service.DELETE_SERVICR), { ids: id });

export const buildService: (payload: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.service.BUILD_SERVICE), payload, { timeout: 60000 });

export const initService: (payload: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.get(getUrl(URL.service.INIT_SERVICE, payload.serviceId), { timeout: 60000 });

// export const getServiceApis: (id: string) => Promise<SuccessResponse<any>> = (id: string) =>
//   request.get(getUrl(URL.service.GET_SERVICE_APIS), { params: { serviceId: id } });

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

export const updateServiceStatus: (ids: any) => Promise<SuccessResponse<any>> = (ids: any) =>
  request.post(getUrl(URL.service.UPDATE_SERVICE_STATUS), { ids });

export const getServiceConfig: (id: any) => Promise<SuccessResponse<any>> = (id: any) =>
  request.get(getUrl(URL.service.GET_SERVICE_CONFIG, id));

export const getServiceUpgrade: (id: any) => Promise<SuccessResponse<any>> = (id: any) =>
  request.get(getUrl(URL.service.GET_SERVICE_UPGRADE_SCRIPT, id));

export const releaseService: (payload: any) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.service.POST_SERVICE_RELEASE), payload);

export const releaseCheck: (serviceId: any) => Promise<SuccessResponse<any>> = (serviceId: any) =>
  request.get(getUrl(URL.service.GET_RELEASE_CHECK), { params: { serviceId } });

// 获取服务接口列表
export const getServiceApiList = (payload: any) =>
  apiProxy(SERVER_TYPES.SERVICE_GENERATOR, service.GET_SERVICE_API_LIST, {
    method: 'GET',
    params: payload,
  });

// 创建服务接口
export const createServiceApi = (payload: any) =>
  apiProxy(SERVER_TYPES.SERVICE_GENERATOR, service.SAVE_SERVICE_API, {
    method: 'POST',
    data: payload,
  });

// 更新服务接口
export const updateServiceApi = (payload: any) =>
  apiProxy(SERVER_TYPES.SERVICE_GENERATOR, service.UPDATE_SERVICE_API, {
    method: 'POST',
    data: payload,
  });

// 删除服务接口
export const delServiceApi = (payload: any) =>
  apiProxy(SERVER_TYPES.SERVICE_GENERATOR, service.DELETE_SERVICE_API, {
    method: 'GET',
    params: payload,
  });

// 获取服务接口
export const findServiceApi = (payload: any) =>
  apiProxy(SERVER_TYPES.SERVICE_GENERATOR, service.GET_SERVICE_API_INFO, {
    method: 'GET',
    params: payload,
  });

// 获取 dto list
export const getAllDtoModel: (serviceId: string) => Promise<SuccessResponse<DtoModel[]>> = (serviceId) =>
  apiProxy(SERVER_TYPES.SERVICE_GENERATOR, service.GET_DTO_MODEL_ALL_LIST, {
    method: 'GET',
    params: {
      serviceId,
    },
  });

// 获取 dto
export const getDtoModel: (params: DtoApiParams) => Promise<SuccessResponse<DtoModel[]>> = (params) =>
  apiProxy(SERVER_TYPES.SERVICE_GENERATOR, service.GET_DTO_MODEL, {
    method: 'GET',
    params,
  });
// 更新 dto
export const updateDtoModelList: (data: DtoModel) => Promise<SuccessResponse<DtoModel[]>> = (data) =>
  apiProxy(SERVER_TYPES.SERVICE_GENERATOR, service.UPDATE_DTO_MODEL, {
    method: 'POST',
    data,
  });
// 新建 dto
export const createDtoModelList: (data: CreatDtoModel) => Promise<SuccessResponse<DtoModel[]>> = (data) =>
  apiProxy(SERVER_TYPES.SERVICE_GENERATOR, service.ADD_DTO_MODEL, {
    method: 'POST',
    data,
  });
// 删除 dto
export const removeDtoModelList: (data: DtoApiParams) => Promise<SuccessResponse<DtoModel[]>> = (data) =>
  apiProxy(SERVER_TYPES.SERVICE_GENERATOR, service.REMOVE_DTO_MODEL, {
    method: 'POST',
    data,
  });

export const dtoModelAPI = {
  findAll: getAllDtoModel,
  findOne: getDtoModel,
  create: createDtoModelList,
  update: updateDtoModelList,
  remove: removeDtoModelList,
};
/**
 * 更新服务参数
 * @param payload
 * @returns
 */
export const saveApiParams = (payload: any) =>
  apiProxy(SERVER_TYPES.SERVICE_GENERATOR, service.SAVE_SERVICE_API_PARAMS, {
    method: 'POST',
    data: payload,
  });

/**
 * 获取服务参数
 * @param payload
 * @returns
 */
export const getApiParams = (payload: any) =>
  apiProxy(SERVER_TYPES.SERVICE_GENERATOR, service.GET_SERVICE_API_PARAMS, {
    method: 'GET',
    params: payload,
  });
export const startCheck: (serviceId: any) => Promise<SuccessResponse<any>> = (serviceId: any) =>
  request.get(getUrl(URL.service.GET_START_CHECK), { params: { serviceId } });

/**
 * 获取服务最新版本
 */

export const getLastVersion: (serviceId: number) => Promise<SuccessResponse<ServiceSnashot>> = (serviceId: number) =>
  apiProxy(SERVER_TYPES.REPO, service.GET_LAST_VERSION, {
    method: 'GET',
    params: {
      serviceId,
    },
  });
