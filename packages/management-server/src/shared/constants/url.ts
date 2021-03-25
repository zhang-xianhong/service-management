import getConfig from 'src/config';

const config = getConfig();
const BASE_URL = `http://${config.BACKEND_SERVICE_API_HOST}:${config.BACKEND_SERVICE_API_PORT}`;
// 服务
// 初始化服务
export const INIT_SERVICE_URL = `${BASE_URL}/sa/dev-sa/sa-service-generator/project/generate/`;

// 初始化服务
export const BUILD_SERVICE_URL = `${BASE_URL}/sa/dev-sa/sa-ci-cd/pipeline/triggerPipeline`;

// 创建服务仓库
export const GENERATE_SERVICE_REPOSITORY_URL = `${BASE_URL}/sa/dev-sa/sa-ci-cd/project`;

// 服务SSH URL
export const SERVICE_SSH_URI = `http://${config.BACKEND_SSHURI_HOST}`;
// export const INIT_SERVICE_URL = `${BASE_URL}/project/generate/`;
// ?token=6c850f80c9b1f80b12e0361ef6c36e&ref=develop&applicationName=sa&projectId=11

// 日志服务
export const LOG_SERVICE_URL = `${BASE_URL}/sa/dev-sa/sa-operator-adapter/log/realtimeLog`;
