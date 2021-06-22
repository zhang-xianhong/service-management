import { queryInTenant } from '@/api/tenant';

const ownerMap: Map<number, any> = new Map();

/**
 * 获取负责人列表
 * @param keyword 关键字查询
 * @param field 内容筛选
 */
async function getOwnerList(keyword = '', owners: Array<any> = [], projects = false) {
  const item: any = { keyword };
  if (projects) {
    item.projectId = localStorage.getItem('projectId');
  }
  const { data } = await queryInTenant(item);
  const users = data;
  // Object.assign(users, owners);
  console.log(owners);
  // const userIds = Array.from(new Set(users.map((item: any) => item.id)));
  // users = users.filter((item: any, index: number) => {
  //   if (userIds.indexOf(item.id) > -1) {
  //     userIds.splice(index, 1);
  //     return true;
  //   }
  //   return false;
  // });
  users.forEach((user: any) => {
    ownerMap.set(user.id, user);
  });
  return users;
}

/**
 * 根据负责人id获取负责人详情
 * @param id 负责人id
 */
function getOwnerById(id: number) {
  return ownerMap.get(id);
}

export { getOwnerList, getOwnerById };
