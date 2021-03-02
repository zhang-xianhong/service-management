import { ref, Ref } from 'vue';

interface BasicForm {
  name: string;
  description: string;
  demand: Array<string>;
  principal: Array<string>;
  versionManagement: boolean;
  classification: string;
  tags: Array<string>;
  detail: string;
  isValid: boolean;
}
interface AdvanceForm {
  objDep: Array<Record<string, string>>;
  svcDep: Array<Record<string, string>>;
  libDep: string;
}
interface RelationRecord {
  type: 'include' | 'reference' | '';
  obj: string;
  objType: 'object' | 'list' | '';
  objAttr: string;
  objMainAttr: string;
}
interface RelationForm {
  objMain: string;
  relationRecords: Array<RelationRecord>;
  isValid: boolean;
}
interface ApiRecord {
  name: string;
  desc: string;
  method: string;
  detail: string;
  isDefault: boolean;
}

const defaultApi = [
  {
    name: 'save',
    desc: '保存',
    url: '/save',
    method: 'POST',
    detail: '',
    isDefault: true,
  },
  {
    name: 'insert',
    desc: '新增',
    method: 'POST',
    detail: '',
    isDefault: true,
  },
  {
    name: 'delete',
    desc: '删除',
    method: 'POST',
    detail: '',
    isDefault: true,
  },
  {
    name: 'update',
    desc: '更新',
    method: 'POST',
    detail: '',
    isDefault: true,
  },
  {
    name: 'get',
    desc: '查看',
    method: 'GET',
    detail: '',
    isDefault: true,
  },
  {
    name: 'list',
    desc: '列表',
    method: 'GET',
    detail: '',
    isDefault: true,
  },
];

export const basicForm: Ref<BasicForm> = ref({
  name: '',
  description: '',
  demand: [],
  principal: [],
  versionManagement: false,
  classification: '',
  tags: [],
  detail: '',
  isValid: true,
});

export const advanceForm: Ref<AdvanceForm> = ref({
  objDep: [],
  svcDep: [],
  libDep: '',
});

export const relationForm: Ref<RelationForm> = ref({
  objMain: '',
  relationRecords: [],
  isValid: true,
});

export const apiRecords: Ref<Array<ApiRecord>> = ref(defaultApi);
