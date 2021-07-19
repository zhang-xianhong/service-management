// 0 表示 api地址， // 1 表示mock地址
export default {
  GET_PROJECT_LIST: ['/projects', '/mock/project/project-list.json'],
  GET_ALL_PROJECT_LIST: ['/projects/all', '/mock/project/project-list-all.json'],
  GET_PROJECT_DETAIL: ['/projects/_', '/mock/project/project-detail.json'],
  UPDATE_PROJECT: ['/projects/_', '/mock/project/project-detail.json'],
  GET_MEMBER_LIST: ['/projects/_/members', '/mock/project/project-members.json'],
  UPDATE_MEMBER: ['/projects/_/members', '/mock/project/project-members.json'],
  DELETE_MEMBER: ['/projects/_/members/delete', '/mock/project/project-members.json'],
  POST_ADD_PROJECT: ['/projects'],
  DELETE_PROJECT: ['/projects/delete'],
  IMAGE_UPLOAD: ['/files/upload'],
  PROJECT_NAME_TEST: ['/projects/name/usable'],
  GET_ROLEAUTH_LIST: ['/projects/_/members', '/mock/project/role-auth-list.json'],
  PROJECT_UPDATE_ROLE: ['/projects/role/_', '/mock/project/role.json'],
  PROJECT_ROLE_AUTH: ['/projects/role/_', '/mock/project/role-auth.json'],
  DELETE_ROLE: ['/projects/_'],
  ADD_ROLE: ['/projects/_', '/mock/project/project-members.json']
};
