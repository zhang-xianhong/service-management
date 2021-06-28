import axios from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';
const { deploy } = URL;
export const getDeployList = (payload: any): Promise<SuccessResponse<any>> =>
  axios.get(getUrl(deploy.GET_DEPLOY_LIST), { params: payload });
