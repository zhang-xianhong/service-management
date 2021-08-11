import _ from 'lodash';

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
function convertTreeToList(tree: any) {
  const array: any[] = [];

  const flat = (nodes: any[]) => {
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        flat(node.children);
      }
      array.push(node);
    });
  };

  flat(tree);

  return array;
}

const convertTreeToArray = _.memoize(convertTreeToList);

/**
 * 获取分类名称
 * @param classificationId
 * @param classificationList
 * @returns
 */
export const getClassificationName = (classificationId: number, classificationList: any) => {
  const array: any[] = convertTreeToArray(JSON.parse(JSON.stringify(classificationList)));
  console.log(array);
  const item = array.find((item) => item.id === Number(classificationId));
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
export const parseDescriptionHtml = (content: string) => content.replace(/\r?\n/gm, '<br/>');
