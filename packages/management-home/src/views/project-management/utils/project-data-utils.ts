import { reactive, ref } from 'vue';
import { getProjectList } from '@/api/project';

export const projectDetail = reactive({} as any);
export const projectList = ref([] as any);
export const codeTemplateList = ref([] as any);

export const getProjectListData = (playload = { page: 1, pageSize: 10 } as any) => {
  getProjectList(playload).then((res) => {
    console.log(res);
  });
};
