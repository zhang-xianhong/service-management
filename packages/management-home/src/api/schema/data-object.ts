import axios from '@/utils/request';
import URL from '@/shared/constant/url';
import { isProduction } from '../utils';
import { DataListResponse } from '@/types/response';
const { API, MOCK } = URL.schema;

export const getDataObjectList = (payload?: object): Promise<DataListResponse> =>
  axios.get((isProduction ? API : MOCK).GET_DATA_OBJECT_LIST, {
    params: payload,
  });
