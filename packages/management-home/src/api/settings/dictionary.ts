import axios from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';
const { settings } = URL;

export const getDictionaryTypes = (): Promise<SuccessResponse<any>> => axios.get(getUrl(settings.GET_DICTIONARY_TYPES));
export const getDictionaryDetail = (typeId: string): Promise<SuccessResponse<any>> =>
  axios.get(getUrl(settings.GET_DICTIONARY_DETAIL, typeId));
