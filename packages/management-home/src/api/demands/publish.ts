import axios from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';
const { publish, service, tenant } = URL;

export const getPublishInfo = (payload: any): Promise<SuccessResponse<any>> =>
  axios.get(getUrl(publish.GET_PUBLISH_INFO), { params: payload });
export const getPublishList = (payload: any): Promise<SuccessResponse<any>> =>
  axios.get(getUrl(publish.GET_PUBLISH_LIST), { params: payload });
export const getPublishReviewList = (payload: any): Promise<SuccessResponse<any>> =>
  axios.get(getUrl(publish.GET_PUBLISH_REVIEW_LIST), { params: payload });
export const addPublish = (payload: any): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(publish.ADD_PUBLISH), payload);
export const updatePublish = (id: string, payload: any): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(publish.UPDATE_PUBLISH, id), payload);
export const deletePublish = (id: string): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(publish.DELETE_PUBLISH, id));
export const reviewPublish = (id: string, payload: any): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(publish.REVIEW_PUBLISH, id), payload);
export const getServiceList: (payload: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  axios.get(getUrl(service.GET_SERVICE_LIST), { params: payload });
export const findUserByName = (payload: any): Promise<SuccessResponse<any>> =>
  axios.get(getUrl(tenant.QUERY_IN_TENT), { params: payload });
