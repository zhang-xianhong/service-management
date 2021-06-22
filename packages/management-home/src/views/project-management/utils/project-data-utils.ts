import { reactive, ref } from 'vue';
import { addProject, getProjectList, deleteProjects } from '@/api/project';
import { getAllTemplates } from '@/api/settings/templates';
import { ElMessageBox } from 'element-plus';
import Message from 'element-plus/es/el-message';

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
    deleteProjects([id]).then((res) => {
      window.location.reload();
    });
  });
};
