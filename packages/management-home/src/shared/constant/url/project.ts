// 0 表示 api地址， // 1 表示mock地址
export default {
  GET_PROJECT_LIST: ['/projects', '/mock/schema/project-list.json'],
  GET_PROJECT_DETAIL: ['/projects/_', '/mock/project/project-detail.json'],
  UPDATE_PROJECT: ['/projects/_', '/mock/project/project-detail.json'],
  GET_MEMBER_LIST: ['/projects/_/members', '/mock/project/project-members.json'],
  GET_MODEL_LIST: ['/projects', '/mock/schema/project-list.json'],
  POST_ADD_PROJECT: ['/projects'],
  DELETE_PROJECT: ['/projects/delete'],
  IMAGE_UPLOAD: ['/files/upload'],
};
