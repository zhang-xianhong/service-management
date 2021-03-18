import { getServiceList } from '@/api/servers';
import { getAllTags } from '@/api/settings/tags';
import { reactive, ref } from 'vue';

export const serviceTableList = reactive({
  list: [],
  total: 10,
} as any);

export const serviceDetail = reactive({} as any);

export const persons = ref([] as any);
export const sorts = ref([] as any);
export const tags = ref([] as any);

export function refreshServiceList(payload = {} as any) {
  return getServiceList(payload).then((res) => {
    serviceTableList.list = res.data.list;
    serviceTableList.total = res.data.total;
  });
}

export const getTagsForService = () =>
  getAllTags().then((res) => {
    console.log(res);
  });
