import axios from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';
const { settings } = URL;

export const getAllTags = (): Promise<SuccessResponse<any>> => axios.get(getUrl(settings.GET_TAGS_ALL));
export const listTags: (payload: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  axios.get(getUrl(settings.GET_TAGS), { params: payload });
export const addTag: (payload: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  axios.post(getUrl(settings.ADD_TAG), payload);
export const updateTag: (payload: any) => Promise<SuccessResponse<any>> = ({ id = '', name = '' }) =>
  axios.post(getUrl(settings.UPDATE_TAG, id), { name });
export const deleteTags: (payload: any) => Promise<SuccessResponse<any>> = (payload) =>
  axios.post(getUrl(settings.DELETE_TAG), payload);
export const checkTagRule: (payload: any) => Promise<SuccessResponse<any>> = (payload) =>
  axios.post(getUrl(settings.CHECK_TAG_RULE), payload);
