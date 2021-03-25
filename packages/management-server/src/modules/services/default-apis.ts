export enum METHOD_TYPE {
  GET,
  POST,
  PUT,
}

export enum TYPE {
  String = 0,
  Integer,
  Long,
  Float,
  Double,
  Boolean,
  Date,
  File,
}

export enum PARAM_TYPE {
  REQUEST_PARAM=0,
  REQUEST_BODY,
  PATH_VARIABLE,
}

export const DEFAULT_APIS = [
  {
    name: 'save',
    url: '/save',
    method: METHOD_TYPE.POST,
    description: '保存',
    params: [
      {
        name: 'body',
        type: TYPE.String,
        paramType: PARAM_TYPE.REQUEST_BODY,
        required: 1,
        paramOrder: 0,
        description: '',
      },
    ],
  },
  {
    name: 'delete',
    url: '/delete',
    method: METHOD_TYPE.POST,
    description: '删除',
    params: [
      {
        name: 'id',
        type: TYPE.Long,
        paramType: PARAM_TYPE.REQUEST_PARAM,
        required: 1,
        paramOrder: 0,
        description: '',
      },
    ],
  },
  {
    name: 'edit',
    url: '/edit',
    method: METHOD_TYPE.POST,
    description: '更新',
    params: [
      {
        name: 'body',
        type: TYPE.String,
        paramType: PARAM_TYPE.REQUEST_BODY,
        required: 1,
        paramOrder: 0,
        description: '',
      },
    ],
  },
  {
    name: 'get',
    url: '/get',
    method: METHOD_TYPE.GET,
    description: '详情',
    params: [
      {
        name: 'id',
        type: TYPE.Long,
        paramType: PARAM_TYPE.REQUEST_PARAM,
        required: 1,
        paramOrder: 0,
        description: '',
      },
    ],
  },
  {
    name: 'list',
    url: '/list',
    method: METHOD_TYPE.GET,
    description: '列表',
    params: [
      {
        name: 'pageNo',
        type: TYPE.Integer,
        paramType: PARAM_TYPE.REQUEST_PARAM,
        defaultValue: 1,
        required: 0,
        paramOrder: 0,
        description: '',
      },
      {
        name: 'pageSize',
        type: TYPE.Integer,
        paramType: PARAM_TYPE.REQUEST_PARAM,
        defaultValue: 10,
        required: 0,
        paramOrder: 0,
        description: '',
      },
    ],
  },
];
