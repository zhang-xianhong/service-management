import { reactive, ref } from 'vue';
import { addProject, getProjectList, deleteProjects } from '@/api/project';
import { getAllTemplates } from '@/api/settings/templates';
import { ElMessageBox } from 'element-plus';
import Message from 'element-plus/es/el-message';

export const projectDetail = reactive({} as any);
export const projectList = ref([] as any);
export const pageInfo = reactive({
  pageSize: 10,
  page: 1,
  keyword: '',
} as any);
export const codeTemplateList = ref([] as any);

export const getProjectListData = () => {
  getProjectList(pageInfo).then((res) => {
    console.log(res);
    projectList.value = res.data.rows;
    pageInfo.total = res.data.count;
  });
};

export const addProjectData = () => addProject(projectDetail);

export const getAllTems = () =>
  getAllTemplates().then((res) => {
    console.log(res);
    codeTemplateList.value = res.data;
  });

export const deleteProject = (id: number) => {
  ElMessageBox.confirm(`确定删除此项目，此操作不可恢复, 是否继续?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      deleteProjects([id]).then((res) => {
        console.log(res);
        getProjectListData();
      });
    })
    .catch(() => {
      Message({
        type: 'info',
        message: '已取消操作',
      });
    });
};
