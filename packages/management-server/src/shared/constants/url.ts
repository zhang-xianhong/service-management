import getConfig from 'src/config';

const config = getConfig();
const BASE_URL = `http://${config.BACKEND_SERVICE_API_HOST}:${config.BACKEND_SERVICE_API_PORT}`;
// 服务变更记录
export const GET_SERVICE_DIFF = `${BASE_URL}/sa/dev-sa/sa-service-generator/version/diff/dev`;

// 服务变更
export const INIT_SERVICE_URL = `${BASE_URL}/sa/dev-sa/sa-service-generator/project/generate`;

// 启动CI/CD
export const BUILD_SERVICE_URL = `${BASE_URL}/sa/dev-sa/sa-ci-cd/pipeline/triggerPipelineProcess`;

// 停止服务
export const STOP_SERVICE_URL = `${BASE_URL}/sa/dev-sa/sa-operator-adapter/deploy/container/stop`;

// 创建服务仓库
export const GENERATE_SERVICE_REPOSITORY_URL = `${BASE_URL}/sa/dev-sa/sa-ci-cd/project`;

// 服务SSH URL
export const SERVICE_SSH_URI = `http://${config.BACKEND_SSHURI_HOST}`;
// export const INIT_SERVICE_URL = `${BASE_URL}/project/generate/`;
// ?token=6c850f80c9b1f80b12e0361ef6c36e&ref=develop&applicationName=sa&projectId=11

// 日志服务
export const LOG_SERVICE_URL = `${BASE_URL}/sa/dev-sa/sa-operator-adapter/log/realtimeLog`;

// 创建IDAAS租户
export const CREATE_IDAAS_TENANT = `${BASE_URL}/sa/dev-sa/tenant/`;


// 用户相关接口
export const USER_SERVICE_BASE_URL = `${BASE_URL}/sa/dev-sa/sa-account`;
// 批量查询用户接口
export const USER_BATCH_SEARCH_URL = `${USER_SERVICE_BASE_URL}/user/profile/batch`;
// 查询租户部门接口
export const FETCH_DEPARTMENT_TREE_URL = `${USER_SERVICE_BASE_URL}/dept/:deptId/tree`;
