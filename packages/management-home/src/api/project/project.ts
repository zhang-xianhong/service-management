import axios from '@/utils/request';
import URL from '@/shared/constant/url';
import { apiProxy } from '../proxy/proxy';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';
import SERVER_TYPE from '@/shared/servertype';
const { project } = URL;

export const getProjectList = (payload?: object): Promise<SuccessResponse<any>> =>
  axios.get(getUrl(project.GET_PROJECT_LIST), {
    params: payload,
  });

export const getProjectDetail = (payload?: string): Promise<SuccessResponse<any>> =>
  axios.get(getUrl(project.GET_PROJECT_DETAIL, payload));

export const updateProject = (projectId: number, payload: any): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(project.UPDATE_PROJECT, String(projectId)), payload);

export const getMemberList = (payload: Record<string, string>): Promise<SuccessResponse<any>> =>
  axios.get(getUrl(project.GET_MEMBER_LIST, payload.projectId));

export const getRoleList = (payload: Record<string, string>): Promise<SuccessResponse<any>> =>
  axios.get(getUrl(project.GET_ROLE_LIST, payload.projectId));

export const updateMembers = (payload: any): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(project.UPDATE_MEMBER, payload.projectId), payload);

export const deleteMember = (payload: any): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(project.DELETE_MEMBER, payload.projectId), payload);

export const imgUpload = (payload: any): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(project.IMAGE_UPLOAD), payload);

export const projectNameTest = (payload: any): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(project.PROJECT_NAME_TEST), payload);

export const getRoleAuthList = () =>
  apiProxy(SERVER_TYPE.AUTH, project.GET_MODULE_LIST, {
    method: 'get',
  });

export const updateRole = (payload: any) =>
  apiProxy(SERVER_TYPE.AUTH, project.UPDATE_ROLE_MODULES, {
    method: 'post',
    data: payload,
  });

export const getAuthByRoleId = (payload: any) =>
  apiProxy(SERVER_TYPE.AUTH, project.PROJECT_ROLE_AUTH, {
    method: 'get',
    data: payload,
  });

export const checkRoleRule = (payload: any) =>
  apiProxy(SERVER_TYPE.AUTH, project.CHECK_ROLE, {
    method: 'get',
    data: payload,
  });

export const ModRoleName = (payload: any) =>
  apiProxy(SERVER_TYPE.AUTH, project.MOD_ROLE, {
    method: 'post',
    data: payload,
  });

export const deleteRole = (payload: any) =>
  apiProxy(SERVER_TYPE.AUTH, project.DELETE_ROLE, {
    method: 'post',
    data: payload,
  });

export const addRole = (payload: any) =>
  apiProxy(SERVER_TYPE.AUTH, project.ADD_ROLE, {
    method: 'post',
    data: payload,
  });
