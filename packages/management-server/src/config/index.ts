import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { resolve } from 'path';

export default () => {
  const env = process.env.NODE_ENV || 'development';
  const config = dotenv.parse(fs.readFileSync(resolve(__dirname, '../../', `.env.${env}`)));
  return config;
};
