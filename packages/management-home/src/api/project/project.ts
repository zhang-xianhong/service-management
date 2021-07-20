import axios from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';
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

export const getRoleAuthList = (payload: Record<string, string>): Promise<SuccessResponse<any>> =>
  axios.get(getUrl(project.GET_ROLEAUTH_LIST, payload.projectId));

export const updateRole = (payload: any): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(project.PROJECT_UPDATE_ROLE, payload.roleId), payload);

export const getAuthByRoleId = (payload: any): Promise<SuccessResponse<any>> =>
  axios.get(getUrl(project.PROJECT_ROLE_AUTH, payload.roleId));

export const deleteRole = (payload: any): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(project.DELETE_ROLE, payload.roleId));

export const addRole = (payload: any): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(project.ADD_ROLE, payload.roleId));

export const checkRoleRule = (payload: any): Promise<SuccessResponse<any>> =>
  axios.get(getUrl(project.CHECK_ROLE, payload.roleId));

export const ModRolename = (payload: any): Promise<SuccessResponse<any>> =>
  axios.post(getUrl(project.MOD_ROLE, payload.roleId));
