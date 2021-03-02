import axios from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { DataListResponse } from '@/types/response';
const { project } = URL;

export const getProjectList = (payload?: object): Promise<DataListResponse> =>
  axios.get(getUrl(project.GET_MODEL_LIST), {
    params: payload,
  });
