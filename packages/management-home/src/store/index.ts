import { ModuleTree, createStore } from 'vuex'

const path = require('path')

// 创建模块处理上下文，此处为./modules及其下子目录
const requireModules = require.context('./modules', true, /index\.(ts|js)$/iu)

const modules: ModuleTree<any> = {}

requireModules.keys().forEach((filePath: string): void => {
  const modular = requireModules(filePath)
  let name = path.resolve(filePath, '..')
  name = name.split('/').pop()
  modules[name] = {
    namespaced: true,
    ...modular.default
  }
})

const store = createStore({
  modules: {
    ...modules
  }
})

export default store
