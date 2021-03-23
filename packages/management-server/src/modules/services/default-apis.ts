import { methodType } from './service-api.model';

export const DEFAULT_APIS = [
  {
    name: 'save',
    url: '/save',
    method: methodType.Post,
    description: '保存',
  },
  {
    name: 'delete',
    url: '/delete',
    method: methodType.Post,
    description: '删除',
  },
  {
    name: 'update',
    url: '/update',
    method: methodType.Post,
    description: '更新',
  },
  {
    name: 'get',
    url: '/get',
    method: methodType.Get,
    description: '详情',
  },
  {
    name: 'list',
    url: '/list',
    method: methodType.Get,
    description: '列表',
  },
];
