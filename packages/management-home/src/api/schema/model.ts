import axios from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { DataListResponse } from '@/types/response';
const { schema } = URL;

export const getModelList = (payload?: object): Promise<DataListResponse> =>
  axios.get(getUrl(schema.GET_MODEL_LIST), {
    params: payload,
  });
