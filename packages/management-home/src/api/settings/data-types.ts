import axios from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
const { settings } = URL;

export const getDataTypes = () => axios.get(getUrl(settings.GET_DATA_TYPES));
