import { ref } from 'vue';
import { getClassificationList } from '@/api/settings/classification';

// 分类Id数组
const classifications = ref([] as number[]);

// 分类信息列表
const allClassifications = ref([]);

// 分类名称
const classificationName = ref('');

const classificationValue = ref([] as number[][]);

// 分类信息Map
const classificationMap: Map<number, any> = new Map();

export default function(initialValue: string) {
  console.log(initialValue, 6666);
  classifications.value = initialValue.split(',').map((item: string) => parseInt(item, 10));

  // 分类信息递归处理
  const handleClassification = (items: any[]) => {
    for (const item of items) {
      if (item.children?.length === 0) {
        item.children = undefined;
      }
      classificationMap.set(item.id, item);
      if (item.children && item.children.length) {
        handleClassification(item.children);
      }
    }
  };

  // 生成分类信息展示名称
  const getClassificationNames = () => {
    const names = classifications.value.map((id: number) => {
      const target = classificationMap.get(id);
      if (target?.name) {
        return target.name;
      }
      return '';
    });
    classificationName.value = names.join(',');
  };

  // 将分类Id数组转换成级联框可以识别的数据结构：Array<Array<number>>
  const handleClassificationIds = () =>
    classifications.value.map((id: number) => {
      let target = classificationMap.get(id);
      const result: number[] = [id];
      while (target?.parentId !== null) {
        result.unshift(target.parentId);
        target = classificationMap.get(target.parentId);
      }
      return result;
    });

  // 获取所有分类信息并处理
  const getClassifications = async () => {
    const { data } = await getClassificationList();
    handleClassification(data);
    allClassifications.value = data;
    const result = await handleClassificationIds();
    classificationValue.value = result;
    getClassificationNames();
  };

  getClassifications();

  return {
    allClassifications,
    classificationName,
    classificationValue,
    getClassificationNames,
  };
}
