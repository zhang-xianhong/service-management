import axios from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';
const { settings } = URL;

export const getRegions = (payload: any): Promise<SuccessResponse<any>> =>
  axios.get(getUrl(settings.GET_REGIONS), payload);
