import getConfig from './';

const {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
} = getConfig();

export default {
  host: REDIS_HOST,
  port: parseInt(REDIS_PORT, 10),
  db: 0,
  password: REDIS_PASSWORD,
  keyPrefix: 'CityBase_',
};
