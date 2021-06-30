import axios from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';
const { deploy } = URL;
export const getDeployList = (payload: any): Promise<SuccessResponse<any>> =>
  axios.get(getUrl(deploy.GET_DEPLOY_LIST), { params: payload });
export const deleteApply = (id: string): Promise<SuccessResponse<any>> => axios.post(getUrl(deploy.DELETE_APPLY, id));
export const addApply = (payload: any): Promise<SuccessResponse<any>> => axios.post(getUrl(deploy.ADD_APPLY), payload);
export const updateApply = (id: string, payload: any): Promise<SuccessResponse<any>> =>
  axios.put(getUrl(deploy.UPDATE_APPLY, id), payload);
