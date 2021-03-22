import { ref } from 'vue';
import { getAllTags } from '@/api/settings/tags';

const tags = ref([] as string[]);

const allTags = ref([] as any[]);

const tagNames = ref('');

export default function(initialValue: string) {
  tags.value = initialValue.split(',');

  const getTagNames = () => {
    const nameArr = tags.value.map((tag: string) => {
      const target = allTags.value.filter((item: any) => item.id === tag)[0];
      return target?.name || '';
    });
    tagNames.value = nameArr.join(',');
  };

  const getTagList = async () => {
    const { data } = await getAllTags();
    allTags.value = data;
    getTagNames();
  };

  getTagList();

  return {
    tags,
    allTags,
    tagNames,
  };
}
