import { queryInTenant } from '@/api/tenant';

const ownerMap: Map<number, any> = new Map();

/**
 * 获取负责人列表
 * @param keyword 关键字查询
 * @param field 内容筛选
 */
async function getOwnerList(keyword = '', field: 'user' | 'department' | 'all' = 'user') {
  const {
    data: { users },
  } = await queryInTenant({ keyword, field });
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
