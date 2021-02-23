
## 本地开发

需要在当前目录下新建`.env.development`文件：

```js
# XXX 代表开发环境配置
HTTP_PORT=8083
CORS_DOMAIN=welink.qq.com
# 数据库
DATABASE_USERNAME=root
DATABASE_PASSWORD=XXX
DATABASE_HOST=XXX
DATABASE_PORT=3306
DATABASE_DB=citybase_dev
# Redis
REDIS_HOST=XXX
REDIS_PORT=XXX
REDIS_PASSWORD=XXX
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).
