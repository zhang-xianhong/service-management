import request from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';

export const checkHealth: () => Promise<SuccessResponse<any>> = () => request.get(getUrl(URL.auth.GET_HEALTH));
