const fs = require('fs')
const Mock = require('mockjs')
const path = require('path')

module.exports = {
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
        target: 'http://localhost:8081',
        ws: true,
        changeOrigin: true
        // 添加所有请求路径前缀/api/
      }
    },
    overlay: {
      warnings: false,
      errors: true
    },
    before (app) {
      // add mockjs request
      app.use('/mock/*', (req, res, next) => {
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
  }
}