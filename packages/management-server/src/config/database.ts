import { join } from 'path';
import getConfig from './';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_DB,
} = getConfig();

export default {
  dialect: 'mysql',
  host: DATABASE_HOST,
  port: parseInt(DATABASE_PORT, 10),
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_DB,
  autoLoadModels: true,
  synchronize: true,
  models: [],
};
