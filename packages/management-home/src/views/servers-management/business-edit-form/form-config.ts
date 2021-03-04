export const svcFormColumns = [
  {
    name: 'name',
    label: '服务名称',
  },
  {
    name: 'desc',
    label: '服务描述',
  },
  {
    name: 'type',
    label: '分类',
  },
  {
    name: 'tag',
    label: '标签',
  },
  {
    name: 'project',
    label: '所属项目',
  },
  {
    name: 'dependence',
    label: '服务依赖',
  },
  {
    name: 'level',
    label: '服务级别',
  },
  {
    name: 'modified',
    label: '修改次数',
  },
];

export const argsRules = {
  memory: [{ required: true, message: '请输入Memroy', trigger: 'blur' }],
  syncSvcPoolSize: [{ required: true, message: '请输入SyncService ThreadPool Size', trigger: 'blur' }],
  baseCtlPoolSize: [{ required: true, message: '请输入BaseController ThreadPool Size', trigger: 'blur' }],
  rabitPoolSize: [{ required: true, message: '请输入RabbitQueueService ThreadPool Size', trigger: 'blur' }],
  esSvcPoolSize: [{ required: true, message: '请输入ESSyncService ThreadPool Size', trigger: 'blur' }],
  jpaPoolSize: [{ required: true, message: '请输入JPAInsertOrUpdateListener ThreadPool Size', trigger: 'blur' }],
  svcBasePoolSize: [{ required: true, message: '请输入SvcBaseService ThreadPool Size', trigger: 'blur' }],
};

export const viewRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  desc: [{ required: true, message: '请输入描述', trigger: 'blur' }],
};

export const relationRules = {
  moduleDependencyId: [{ required: true, message: '请选择主对象', trigger: 'blur' }],
};
