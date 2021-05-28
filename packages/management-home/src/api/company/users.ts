import request from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';

export const getUserList: (payload?: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.get(getUrl(URL.company.GET_USER_LIST), { params: payload });

// 新建
export const createUser: (payload?: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.company.CREATE_USER), payload);
// 编辑
export const updateUser: (payload?: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.company.UPDATE_USER, payload.id), payload);
// 批量删除
export const delUser: (payload?: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.company.DEL_USER), payload);
// 批量修改状态
export const updateUserStatus: (payload?: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.company.UPDATE_USER_STATUS), payload);
// 修改密码
export const resetPassWd: (payload?: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.company.UPDATE_USER_PASSWD), payload);
// 输入信息校验
export const checkUserInfo: (payload?: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.company.CHECK_INPUT), payload);
