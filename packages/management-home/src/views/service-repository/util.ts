/**
 * 过滤空children
 * @param list
 */
export const filterClassificationList = (list: any) => {
  const newList = [...list];
  const filter = (item: any) => {
    if (item.children && item.children.length > 0) {
      item.children.forEach((child: any) => {
        filter(child);
      });
    } else {
      // eslint-disable-next-line no-param-reassign
      delete item.children;
    }
  };
  newList.forEach((item) => filter(item));
  return newList;
};

function visitNode(node: any, hashMap: any, array: any[]) {
  if (!hashMap[node.data]) {
    // eslint-disable-next-line no-param-reassign
    hashMap[node.data] = true;
    array.push(node);
  }
}
function convertTreeToList(root: any) {
  const stack = [];
  const array: any[] = [];
  const hashMap = {};
  stack.push(root);

  while (stack.length !== 0) {
    const node = stack.pop();
    if (node.children === null) {
      visitNode(node, hashMap, array);
    } else {
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push(node.children[i]);
      }
    }
  }

  return array;
}

/**
 * 获取分类名称
 * @param classificationId
 * @param classificationList
 * @returns
 */
export const getClassificationName = (classificationId: number, classificationList: any[]) => {
  const array: any[] = convertTreeToList(classificationList);
  const item = array.find((item) => item.id === classificationId);
  return item?.name || '';
};

/**
 * 获取标签名称
 * @param tagIds
 * @param tagList
 * @returns
 */
export const getTagsName = (tagIds: any[], tagList: any[]) => {
  const ids = tagIds.filter((id) => id).map((id) => Number(id));
  const tags = tagList.filter((item) => ids.includes(item.id)).map((item) => item.name);
  return tags.join(',');
};
