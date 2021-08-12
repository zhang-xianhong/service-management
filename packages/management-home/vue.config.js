const fs = require('fs')
const Mock = require('mockjs')
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/styles/common/index.scss";'
      }
    }
  },
  devServer: {
    host: 'dev.sa.qq.com',
    port: '80',
    watchOptions: {
      ignored: /node_modules/
    },
    proxy: {
      // 代理所有请求
      '/api': {
        // 后端rest服务
        // target: 'http://sunlight.test-citybase.oa.com',
        // target: 'http://tenant1.dev-citybase.oa.com', // 开发集成环境
        // target: 'http://cqszjj.dev-citybase.oa.com',
        // target: 'http://fbxxyxgs.test-citybase.oa.com',
        target: 'http://magneeeto.dev-citybase.oa.com',
        // target: 'http://sunlight.test-citybase.oa.com',
        // target: 'http://http://yunzhi.dev-citybase.oa.com/',
        ws: true,
        changeOrigin: true
        // 添加所有请求路径前缀/api/
      }
    },
    overlay: {
      warnings: false,
      errors: true
    },
    before(app) {
      // add mockjs request
      app.use('/api/mock/*', (req, res, next) => {
        const filePath = path.resolve(__dirname, './mock', req.params[0])
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            return next(err)
          }
          try {
            res.json(Mock.mock(JSON.parse(data)))
          } catch (err) {
            return next(err)
          }
        })
      })
    }
  },
  chainWebpack(config) {
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end();
  },
};
