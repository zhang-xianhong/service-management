// 0 表示 api地址， // 1 表示mock地址
export default {
  GET_DATA_TYPES: ['/settings/data-types', '/mock/settings/data-types.json'],
  GET_TAGS_ALL: ['settings/tags/all', '/mock/settings/all-tags.json'],
  GET_CATEGORIES: ['settings/categories/tree', '/mock/settings/category-options.json'],
  GET_CLASSIFICATION_LIST: ['/settings/categories/tree', '/mock/settings/classification-list.json'],
  GET_CLASSIFICATION_DETAIL: ['/settings/categories/_', '/mock/settings/classification-detail.json'],
  DELETE_CLASSIFICATION: ['/settings/categories/delete/_', '/mock/settings/classification-delete.json'],
  UPDATE_CLASSIFICATION: ['/settings/categories/_', '/mock/settings/classification-update.json'],
  ADD_CLASSIFICATION: ['/settings/categories', '/mock/settings/classification-update.json'],
};
