import request from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';
const { repository } = URL;

// 获取仓库列表
export const getRepositoryList: (payload: any) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.get(getUrl(repository.GET_REPOSITORY_LIST_URL), { params: payload });

// 拉取到租户仓库
export const pullRepository: (payload: any) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(repository.POST_PULL_REPOSITORY), payload);
