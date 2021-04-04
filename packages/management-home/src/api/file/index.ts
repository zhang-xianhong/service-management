import request from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';

export const upload: () => Promise<SuccessResponse<any>> = () => request.post(getUrl(URL.file.UPLOAD_PICTURE));
