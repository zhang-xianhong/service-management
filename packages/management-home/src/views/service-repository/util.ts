import useClassifications from '@/views/service-management/business-service/utils/service-baseinfo-classification';
/**
 * 获取分类名称
 * @param classificationId
 * @param classificationList
 * @returns
 */
export const getClassificationName = (classificationId: number, classificationList: any[]) => {
  const classData = useClassifications(String(classificationId), classificationList);
  return classData.classificationName.value;
};
/**
 * 获取标签名称
 * @param tagIds
 * @param tagList
 * @returns
 */
export const getTagsName = (tagIds: number[], tagList: any[]) => {
  const tags = tagList.filter((item) => tagIds.includes(item.id)).map((item) => item.name);
  return tags.join(',');
};
