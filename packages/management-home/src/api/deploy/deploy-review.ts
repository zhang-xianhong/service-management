import axios from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';
const { deploy } = URL;
export const getReviewList = (payload: any): Promise<SuccessResponse<any>> =>
  axios.get(getUrl(deploy.GET_REVIEW_LIST), { params: payload });
export const approveServiceApply = (id: string): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(deploy.APPROVE_APPLY), { params: id });
