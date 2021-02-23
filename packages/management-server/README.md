
## 本地开发

需要在当前目录下新建`.env.development`文件：
```js
HTTP_PORT=8083
CORS_DOMAIN=welink.qq.com
# 数据库
DATABASE_USERNAME=root
DATABASE_PASSWORD=SDXje)3497uB
DATABASE_HOST=9.134.44.52
DATABASE_PORT=3306
DATABASE_DB=citybase_dev
# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=127.0.0.1
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
