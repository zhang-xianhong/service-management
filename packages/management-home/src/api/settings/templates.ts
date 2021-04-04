import axios from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';
const { settings } = URL;

// eslint-disable-next-line
// @ts-ignore
export const getAllTemplates = (): Promise<SuccessResponse<any>> => axios.get(getUrl(settings.GET_ALL_TEMPLATE));
