import { join } from 'path';
import getConfig from './';

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_DB,
} = getConfig();

export default {
  type: 'mysql',
  host: DATABASE_HOST,
  port: parseInt(DATABASE_PORT, 10),
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_DB,
  entities: [join(__dirname, '../', '**/entity{.ts,.js}')],
  synchronize: true,
};
