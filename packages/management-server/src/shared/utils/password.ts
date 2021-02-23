import * as crypto from 'crypto';

/**
 * 创建加盐后的密码字符串
 * @param password
 * @param salt
 */
export const genHashPassword = (password: string, salt: string): string => {
  const md5 = crypto.createHash('md5');
  const hash = crypto.pbkdf2Sync(
    password, salt,
    1000, 64, 'sha512',
  ).toString('hex');
  return md5.update(hash).digest('hex');
};

/**
 * 校验密码
 * @param password
 * @param hashPassword
 * @param salt
 */
export const validPassword = (password: string, hashPassword: string, salt: string): boolean => {
  const hash = genHashPassword(password, salt);
  return hashPassword === hash;
};

interface Password {
  salt: string
  hash: string
}

/**
 * 创建密码信息
 * @param password
 */
export const genPassword = (password: string): Password => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = genHashPassword(password, salt);
  return {
    salt,
    hash,
  };
};
