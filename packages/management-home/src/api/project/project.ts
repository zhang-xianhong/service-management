import axios from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';
const { project } = URL;

export const getProjectDetail = (payload?: string): Promise<SuccessResponse<any>> =>
  axios.get(getUrl(project.GET_PROJECT_DETAIL, payload));

export const updateProject = (projectId: number, payload: Record<string, string>): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(project.UPDATE_PROJECT, String(projectId)), payload);
