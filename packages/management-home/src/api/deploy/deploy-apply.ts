import axios from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';
const { deploy } = URL;
export const getDeployList = (payload: any): Promise<SuccessResponse<any>> =>
  axios.get(getUrl(deploy.GET_DEPLOY_LIST), { params: payload });
export const deleteApply = (id: string): Promise<SuccessResponse<any>> => axios.post(getUrl(deploy.DELETE_APPLY, id));
export const addApply = (payload: any): Promise<SuccessResponse<any>> => axios.post(getUrl(deploy.ADD_APPLY), payload);
export const updateApply = (id: number, payload: any): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(deploy.UPDATE_APPLY, id.toString()), payload);
export const getServiceList: (payload?: any) => Promise<SuccessResponse<any>> = (payload?: any) =>
  axios.get(getUrl(deploy.GET_SERVICE_LIST), { params: payload });
// export const getServiceList: () => Promise<SuccessResponse<any>> = () =>
//   axios.get(getUrl(deploy.GET_SERVICE_LIST));
export const findPublisherByName = (payload?: any): Promise<SuccessResponse<any>> =>
  axios.get(getUrl(deploy.QUERY_IN_TENT), { params: payload });
export const getSnapshotNo: (id: number) => Promise<SuccessResponse<any>> = (id: number) =>
  axios.get(getUrl(deploy.GET_SNAPSHOT_NO, id.toString()));
