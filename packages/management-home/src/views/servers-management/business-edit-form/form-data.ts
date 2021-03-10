import { ref, Ref } from 'vue';
import _ from 'lodash';

interface BasicForm {
  name: string;
  description: string;
  demand: Array<string>;
  owner: string;
  versionManagement: boolean;
  classification: string;
  tag: string;
  detail: string;
  isValid: boolean;
}
interface AdvanceForm {
  objDep: Array<Record<string, string>>;
  dependencies: Array<Record<string, string>>;
  libDep: Array<Record<string, string>>;
}
interface RelationRecord {
  type: 'include' | 'reference' | '';
  obj: string;
  objType: 'object' | 'list' | '';
  objAttr: string;
  objMainAttr: string;
}
interface RelationForm {
  moduleDependencyId: string;
  relationRecords: Array<RelationRecord>;
  isValid: boolean;
}
export interface ApiRecord {
  name: string;
  description: string;
  method: string;
  detail: string;
  isDefault: boolean;
}

interface EditObjRecord {
  obj: string;
  id: string;
  desc: string;
  type: '可编辑' | '只显示' | '隐藏';
  name: string;
  required: true | false;
  component: string;
  group: string;
  order: string;
}
interface EditViewRecord {
  name: string;
  desc: string;
  type: '编辑视图';
  attrs: Array<EditObjRecord>;
  methods: Array<string>;
}
interface ListObjRecord {
  obj: string;
  id: string;
  desc: string;
  show: true | false;
  name: string;
  order: string;
}
interface ListViewRecord {
  name: string;
  desc: string;
  type: '列表视图';
  attrs: Array<ListObjRecord>;
}

export interface ChangeRecord {
  time: string;
  type: string;
  message: string;
}

const setDefault: Array<Function> = [];

const defaultBasicForm = {
  name: '',
  description: '',
  demand: [],
  owner: '',
  versionManagement: false,
  classification: '',
  tag: '',
  detail: '',
  isValid: true,
};
export const basicForm: Ref<BasicForm> = ref(_.cloneDeep(defaultBasicForm));
setDefault.push(() => {
  basicForm.value = _.cloneDeep(defaultBasicForm);
});

const defaultAdvanceForm = {
  objDep: [],
  dependencies: [],
  libDep: [],
};
export const advanceForm: Ref<AdvanceForm> = ref(_.cloneDeep(defaultAdvanceForm));
setDefault.push(() => {
  advanceForm.value = _.cloneDeep(defaultAdvanceForm);
});

const defaultRelationForm = {
  moduleDependencyId: '',
  relationRecords: [],
  isValid: true,
};
export const relationForm: Ref<RelationForm> = ref(_.cloneDeep(defaultRelationForm));
setDefault.push(() => {
  relationForm.value = _.cloneDeep(defaultRelationForm);
});

const defaultApi = [
  {
    name: 'save',
    description: '保存',
    url: '/save',
    method: 'POST',
    detail: '',
    isDefault: true,
  },
  {
    name: 'insert',
    description: '新增',
    method: 'POST',
    detail: '',
    isDefault: true,
  },
  {
    name: 'delete',
    description: '删除',
    method: 'POST',
    detail: '',
    isDefault: true,
  },
  {
    name: 'update',
    description: '更新',
    method: 'POST',
    detail: '',
    isDefault: true,
  },
  {
    name: 'get',
    description: '查看',
    method: 'GET',
    detail: '',
    isDefault: true,
  },
  {
    name: 'list',
    description: '列表',
    method: 'GET',
    detail: '',
    isDefault: true,
  },
];
export const apis: Ref<Array<ApiRecord>> = ref(_.cloneDeep(defaultApi));
setDefault.push(() => {
  apis.value = _.cloneDeep(defaultApi);
});

const defaultViewData: Array<EditViewRecord | ListViewRecord> = [];
export const viewData: Ref<Array<EditViewRecord | ListViewRecord>> = ref(_.cloneDeep(defaultViewData));
setDefault.push(() => {
  viewData.value = _.cloneDeep(defaultViewData);
});

const defaultEditForm: EditViewRecord = {
  name: '',
  desc: '',
  type: '编辑视图',
  attrs: [],
  methods: [],
};
export const editForm: Ref<EditViewRecord> = ref(_.cloneDeep(defaultEditForm));
setDefault.push(() => {
  editForm.value = _.cloneDeep(defaultEditForm);
});

const defaultListForm: ListViewRecord = {
  name: '',
  desc: '',
  type: '列表视图',
  attrs: [],
};

export const listForm: Ref<ListViewRecord> = ref(_.cloneDeep(defaultListForm));
setDefault.push(() => {
  listForm.value = _.cloneDeep(defaultListForm);
});

export const changes: Ref<Array<ChangeRecord>> = ref([
  {
    time: '2021-01-22 23:43:40',
    type: 'change',
    message: '狗蛋_启动服务',
  },
  {
    time: '2021-01-22 23:43:16',
    type: 'commit',
    message: '狗蛋_删除代码',
  },
]);

export const analysisData = ref({
  changes: 1,
  svcDep: [{ label: 'testSvc', value: 1 }],
  objDep: [{ label: 'testObj', value: 1 }],
  directDep: [{ label: 'testDep', value: 1 }],
  indirectDep: [{ label: 'testDep2', value: 1 }],
  reverseDep: [
    { label: 'testDep', value: 1 },
    { label: 'testDep2', value: 1 },
  ],
  extend: [{ label: 'testExtend', value: 1 }],
  extended: [],
  history: ['狗蛋_新增_2021-01-22 22:40:16'],
});

export function resetForm() {
  setDefault.forEach((func) => {
    func();
  });
}
