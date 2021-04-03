import request from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';

export const getProjectList: (payload: object) => Promise<SuccessResponse<any>> = (payload: object) =>
  request.get(getUrl(URL.project.GET_PROJECT_LIST), {
    params: payload,
  });
