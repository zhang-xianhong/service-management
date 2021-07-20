import axios from '@/utils/request';
import URL from '@/shared/constant/url';
import { apiProxy } from '../proxy/proxy';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';
import SERVERTYPE from '@/shared/servertype';
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

export const updateMembers = (payload: any): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(project.UPDATE_MEMBER, payload.projectId), payload);

export const deleteMember = (payload: any): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(project.DELETE_MEMBER, payload.projectId), payload);

export const imgUpload = (payload: any): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(project.IMAGE_UPLOAD), payload);

export const projectNameTest = (payload: any): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(project.PROJECT_NAME_TEST), payload);

export const getRoleAuthList = () =>
  apiProxy(SERVERTYPE.AUTH, project.GET_ROLEAUTH_LIST, {
    method: 'get',
  });

export const updateRole = (payload: any): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(project.PROJECT_UPDATE_ROLE, payload.roleId), payload);

export const getAuthByRoleId = (payload: any) =>
  apiProxy(SERVERTYPE.AUTH, project.PROJECT_ROLE_AUTH, {
    method: 'get',
    params: payload,
  });

export const checkRoleRule = (payload: any): Promise<SuccessResponse<any>> =>
  axios.get(getUrl(project.CHECK_ROLE, payload.roleId));

export const ModRolename = (payload: any): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(project.MOD_ROLE, payload.roleId));

export const deleteRole = (payload: any) =>
  apiProxy(SERVERTYPE.AUTH, project.DELETE_ROLE, {
    method: 'post',
    data: payload,
  });

export const addRole = (payload: any) =>
  apiProxy(SERVERTYPE.AUTH, project.ADD_ROLE, {
    method: 'post',
    data: payload,
  });
