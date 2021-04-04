import axios from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { DataListResponse, SuccessResponse } from '@/types/response';
const { project } = URL;

export const getProjectList = (payload?: object): Promise<DataListResponse> =>
  axios.get(getUrl(project.GET_PROJECT_LIST), {
    params: payload,
  });

export const getProjectDetail = (payload?: string): Promise<SuccessResponse<any>> =>
  axios.get(getUrl(project.GET_PROJECT_DETAIL, payload));

export const updateProject = (projectId: number, payload: any): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(project.UPDATE_PROJECT, String(projectId)), payload);

export const getMemberList = (payload: Record<string, string>): Promise<SuccessResponse<any>> =>
  axios.get(getUrl(project.GET_MEMBER_LIST, payload.projectId));
