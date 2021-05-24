import { getUserInfo } from '@/api/auth';
import { userCurrentProject, userInfo, userMenus, userProjectList } from '@/layout/messageCenter/user-info';
import { resetPremissionRouter } from '@/router';
import { routerLoading } from '@/layout/messageCenter/routerRef';

let localsid = localStorage.getItem('projectId') as any;
localsid = Number.isNaN(Number(localsid)) ? 0 : Number(localsid);

export const getUser = async () => {
  const { data } = await getUserInfo({ projectId: localsid });
  const { info, projects } = data;
  const { userAuth } = info;
  userInfo.value = info;
  const menuObj = {} as any;
  userAuth.forEach((x: any) => {
    menuObj[x.id] = [];
    if (x.modules) {
      x.modules.forEach((y: any) => {
        if (y.code) {
          menuObj[x.id] = [...y.code.split('-'), ...menuObj[x.id]];
        }
      });
    }
    menuObj[x.id] = [...new Set(menuObj[x.id])];
  });
  userMenus.value = menuObj;
  userProjectList.value = projects;
  resetPremissionRouter();
  routerLoading.value = !routerLoading.value;
  if (projects.length) {
    const includes = localsid && projects.map((x: any) => x.id).includes(localsid);
    if (!includes) {
      // eslint-disable-next-line prefer-destructuring
      userCurrentProject.value = projects[0];
      localStorage.setItem('projectId', projects[0].id);
      window.location.href = '/';
    } else {
      projects.forEach((x: any) => {
        if (localsid === x.id) {
          userCurrentProject.value = x;
        }
      });
    }
  }
};
