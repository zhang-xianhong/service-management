import request from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';

export const getProjectList: (payload: object) => Promise<SuccessResponse<any>> = (payload: object) =>
  request.get(getUrl(URL.project.GET_PROJECT_LIST), {
    params: payload,
  });

export const getAllProjectList: (payload: object) => Promise<SuccessResponse<any>> = (payload: object) =>
  request.get(getUrl(URL.project.GET_ALL_PROJECT_LIST), {
    params: payload,
  });

export const addProject: (payload: object) => Promise<SuccessResponse<any>> = (payload: object) =>
  request.post(getUrl(URL.project.POST_ADD_PROJECT), payload);

export const deleteProjects: (ids: any) => Promise<SuccessResponse<any>> = (ids: any) =>
  request.post(getUrl(URL.project.DELETE_PROJECT), { ids });
