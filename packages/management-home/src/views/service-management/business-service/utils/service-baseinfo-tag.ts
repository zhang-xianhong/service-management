import { ref } from 'vue';

const tagValue = ref([] as number[]);

const tagNames = ref('');

export default function(initialValue: string, tags: any[]) {
  tagValue.value = initialValue
    .split(',')
    .filter((item: string) => item !== '')
    .map((item: string) => Number.parseInt(item, 10));

  const getTagNames = (tags: any[]) => {
    const nameArr = tagValue.value.map((tag: number) => {
      const target = tags.filter((item: any) => item.id === tag)[0];
      return target?.name || '';
    });
    tagNames.value = nameArr.join(',');
  };

  getTagNames(tags);

  return {
    tagValue,
    tagNames,
  };
}
