import axios from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';
const { settings } = URL;

export const getAllTags = () => axios.get(getUrl(settings.GET_TAGS_ALL));
export const listTags: (payload: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  axios.get(getUrl(settings.GET_TAGS), { params: payload });
