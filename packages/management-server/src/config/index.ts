import * as dotenv from 'dotenv';
import * as fs from 'fs';

export default () => {
  const env = process.env.NODE_ENV || 'development';
  const config = dotenv.parse(fs.readFileSync(`${__dirname}/.env.${env}`));
  return config;
};
