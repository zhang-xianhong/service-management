// 0 表示 api地址， // 1 表示mock地址
export default {
  GET_REPOSITORY_LIST_URL: ['/repository/services', 'mock/repository/list.json'],
  POST_PULL_REPOSITORY: ['/repository/pull', 'mock/repository/pull.json'],
  POST_SHARE_REPOSITORY: ['/repository/share', 'mock/repository/pull.json'],
  POST_DISTRIBUTE_REPOSITORY: ['/repository/distribute', 'mock/repository/pull.json'],
  GET_REPOSITORY_DETAIL_URL: ['/repository/_/detail', 'mock/repository/detail.json'],
};
