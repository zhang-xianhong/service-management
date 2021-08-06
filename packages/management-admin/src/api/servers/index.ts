// import request from '@/utils/request';
// import URL from '@/shared/constant/url';
// import { getUrl } from '../utils';
// import { SuccessResponse } from '@/types/response';
import SERVER_TYPES from '@/shared/servertype';
import service from '@/shared/constant/url/service';
import { apiProxy } from '../proxy/proxy';
/**
 * 发送验证码
 * @param payload
 * @returns
 */
export const sendRetrievePasswordVerifyCode = (payload: any) =>
  apiProxy(SERVER_TYPES.ACCOUNT, service.SEND_RETRIEVE_PASSWD_VERIFY_CODE, {
    method: 'GET',
    params: payload,
  });

/**
 * 重置密码
 * @param payload
 * @returns
 */
export const retrievePassword = (payload: any) =>
  apiProxy(SERVER_TYPES.ACCOUNT, service.RETRIEVE_PASSWD, {
    method: 'POST',
    data: payload,
  });
