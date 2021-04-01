import { SERVICE_STATUS } from './service-status';

export enum LOG_NAME {
  SERVICE_GENERATOR = 'sa-service-generator',
  CI_CD = 'sa-ci-cd'
}

export const getLogName = (status: number) => {
  if (status < SERVICE_STATUS.STARTING) {
    return LOG_NAME.SERVICE_GENERATOR;
  }
  return LOG_NAME.CI_CD;
};
