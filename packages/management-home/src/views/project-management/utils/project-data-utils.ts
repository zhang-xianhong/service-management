import { reactive, ref } from 'vue';
import { addProject, getProjectList, deleteProjects } from '@/api/project';
import { getAllTemplates } from '@/api/settings/templates';
import { ElMessageBox } from 'element-plus';

export const projectDetail = reactive({
  license: 1,
  level: 3,
  status: 1,
} as any);
export const projectList = ref([] as any);
export const pageInfo = reactive({
  pageSize: 10,
  page: 1,
  keyword: '',
} as any);
export const codeTemplateList = ref([] as any);

export const getProjectListData = () =>
  getProjectList(pageInfo).then((res) => {
    const ownersMap = {} as any;
    if (res.data.ownerUsers) {
      res.data.ownerUsers.forEach((x: any) => {
        ownersMap[x.id] = x;
      });
      res.data.rows.forEach((x: any) => {
        // eslint-disable-next-line no-param-reassign
        x.ownerstr = x.owners
          .map((x: any) => ownersMap[x.userId]?.displayName)
          .filter((x: any) => x)
          .join(',');
      });
    }
    projectList.value = res.data.rows;
    pageInfo.total = res.data.count;
  });

export const addProjectData = () => addProject(projectDetail);

export const getAllTems = () =>
  getAllTemplates().then((res) => {
    codeTemplateList.value = res.data;
  });

export const deleteProject = (id: number) => {
  ElMessageBox.confirm(`确定删除当前项目？`, '提示', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    deleteProjects([id]).then(() => {
      window.location.reload();
    });
  });
};

export const getTreeArr = (obj: any): any => {
  if (!Array.isArray(obj.data)) {
    console.debug('getTreeArr=>请传入数组');
    return [];
  }
  const arr = obj.data;
  const treeArray: any = [];
  arr.forEach((item: any) => {
    // eslint-disable-next-line no-param-reassign
    // item = item?.get?.({ plain: true }) || item;
    let index = 0;
    // eslint-disable-next-line no-param-reassign
    item.children = [];
    if (!item.isDelete) {
      arr.forEach((item1: any) => {
        // 得到树结构关系
        if (item[obj.key] === item1[obj.pKey] && !item1.isDelete) {
          item.children.push(item1);
        }
        // 判断根节点
        if (item1[obj.key] !== item[obj.pKey]) {
          index += 1;
        }
      });
      // 没传入根节点，根据当前数据结构得到根节点
      if (!('rootPValue' in obj) && index === arr.length) {
        treeArray.push(item);
      }
    }
  });
  // 传入根节点，根据传入的根节点组成树结构
  if ('rootPValue' in obj) {
    arr.forEach((item: any) => {
      if (item[obj.pKey] === obj.rootPValue) {
        treeArray.push(item);
      }
    });
  }
  return treeArray;
};
