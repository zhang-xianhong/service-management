import request from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';

export const getTenentDepartment = (payload?: object): Promise<SuccessResponse<any>> =>
  request.get(getUrl(URL.tenant.GET_TENANT_DEPT), { params: payload });
// 新建子部门
export const createDept: (payload?: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.company.CREATE_DEPT), payload);
// 删除部门
export const delDept: (payload?: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.company.DEL_DEPT, payload.id), payload);
// 删除人员
export const delUser: (payload?: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.company.DEL_DEPT_USER, payload.id), payload);
// 添加人员
export const addUser: (payload?: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.company.ADD_USER, payload.id), payload);
// 更新部门
export const updateDept: (payload?: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.company.UPDATE_DEPT, payload.id), payload);
