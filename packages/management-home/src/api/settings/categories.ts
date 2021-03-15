import axios from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
const { settings } = URL;

export const getAllCategories = () => axios.get(getUrl(settings.GET_CATEGORIES));
