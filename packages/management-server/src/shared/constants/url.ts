import getConfig from 'src/config';

const config = getConfig();
const BASE_URL = `http://${config.BACKEND_SERVICE_API_HOST}:${config.BACKEND_SERVICE_API_PORT}`;
// 服务
// 初始化服务
export const INIT_SERVICE_URL = `${BASE_URL}/sa/dev-sa/sa-service-generator/project/generate/`;
// export const INIT_SERVICE_URL = `${BASE_URL}/project/generate/`;
