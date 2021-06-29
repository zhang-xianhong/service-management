import request from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';
const {repository} = URL
export const getRepositoryList: (payload: any) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.get(getUrl(repository.GET_REPOSITORY_LIST_URL), { params: payload });
