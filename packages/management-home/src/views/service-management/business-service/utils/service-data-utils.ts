import { getServiceList, deleteService } from '@/api/servers';
import { getAllTags } from '@/api/settings/tags';
import { reactive, ref } from 'vue';
import { getClassificationList } from '@/api/settings/classification';

export const serviceTableList = reactive({
  list: [],
  total: 10,
} as any);
export const allService = ref([] as any);

export const serviceDetail = reactive({} as any);

export const persons = ref([] as any);
export const sorts = ref([] as any);
export const tags = ref([] as any);

export function refreshServiceList(payload = {} as any) {
  let data = {} as any;
  if (payload) {
    data = { ...payload };
    data.tags = payload.tags ? payload.tags.join(',') : '';
  }
  Object.keys(data).forEach((x) => {
    if (!data[x]) {
      delete data[x];
    }
  });
  return getServiceList(data).then((res) => {
    if (res.data.rows) {
      res.data.rows.forEach((x: any) => {
        // eslint-disable-next-line no-param-reassign
        x.name = x.name.replace(/^srv-/g, '');
      });
    }
    serviceTableList.list = res.data.rows;
    serviceTableList.total = res.data.count;
  });
}

export const getTagsForService = () =>
  getAllTags().then((res) => {
    tags.value = res.data;
  });

export function deleteBlankArray(item: any) {
  if (item.children && item.children.length > 0) {
    item.children.forEach((x: any) => {
      deleteBlankArray(x);
    });
  } else {
    // eslint-disable-next-line no-param-reassign
    item.children = '';
    // eslint-disable-next-line no-param-reassign
    delete item.children;
  }
}

export const getClassifications = () =>
  getClassificationList().then((res) => {
    const ids = { children: res.data };
    deleteBlankArray(ids);
    sorts.value = ids.children;
  });

export const deleteServiceForList = (arr: Array<any>) => {
  const data = arr.map((x) => x.id);
  return deleteService(data as any).then((res) => {
    console.log(res);
  });
};

export function getAllService() {
  return getServiceList({ all: true }).then((res) => {
    if (res.data && res.data.rows) {
      res.data.rows.forEach((x: any) => {
        // eslint-disable-next-line no-param-reassign
        x.name = x.name.replace(/^srv-/g, '');
      });
      allService.value = res.data.rows;
    } else {
      allService.value = [];
    }
  });
}
