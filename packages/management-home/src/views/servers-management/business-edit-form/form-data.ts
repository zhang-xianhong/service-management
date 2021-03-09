import { ref, Ref } from 'vue';

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

export const basicForm: Ref<BasicForm> = ref({
  name: '',
  description: '',
  demand: [],
  owner: '',
  versionManagement: false,
  classification: '',
  tag: '',
  detail: '',
  isValid: true,
});

export const advanceForm: Ref<AdvanceForm> = ref({
  objDep: [],
  dependencies: [],
  libDep: [],
});

export const relationForm: Ref<RelationForm> = ref({
  moduleDependencyId: '',
  relationRecords: [],
  isValid: true,
});

export const apis: Ref<Array<ApiRecord>> = ref(defaultApi);

export const viewData: Ref<Array<EditViewRecord | ListViewRecord>> = ref([]);

const defaultEditForm: EditViewRecord = {
  name: '',
  desc: '',
  type: '编辑视图',
  attrs: [],
  methods: [],
};
const defaultListForm: ListViewRecord = {
  name: '',
  desc: '',
  type: '列表视图',
  attrs: [],
};
export const editForm: Ref<EditViewRecord> = ref(defaultEditForm);
export const listForm: Ref<ListViewRecord> = ref(defaultListForm);
