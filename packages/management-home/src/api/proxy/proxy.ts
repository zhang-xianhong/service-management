import proxy from '@/shared/constant/url/proxy';
import { SuccessResponse } from '@/types/response';
import request from '@/utils/request';
import { getUrl } from '../utils';
export const apiProxy = (module: string, action: string[], data: any): Promise<SuccessResponse<any>> => {
  const url = !getUrl(proxy.PROXY).includes('mock')
    ? `${getUrl(proxy.PROXY)}?module=${module}&action=${getUrl(action)}`
    : getUrl(action);
  return request.post(url, data, {
    headers: {
      isProxy: true,
    },
  });
};
